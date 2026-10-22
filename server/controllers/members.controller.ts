import { Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateMemberId } from '../utils/idGenerator';

// List all members with filtering, search & pagination
export const getMembers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search, status, trainerId, planId, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (trainerId) {
      where.assignedTrainerId = trainerId;
    }

    if (planId) {
      where.membershipPlanId = planId;
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { fullName: { contains: q } },
        { phone: { contains: q } },
        { memberId: { contains: q } },
        { user: { email: { contains: q } } },
      ];
    }

    // If logged in as trainer, only show assigned members if not admin
    if (req.user?.role === 'TRAINER') {
      const trainer = await prisma.trainerProfile.findUnique({ where: { userId: req.user.id } });
      if (trainer) {
        where.assignedTrainerId = trainer.id;
      }
    }

    const [total, members] = await Promise.all([
      prisma.memberProfile.count({ where }),
      prisma.memberProfile.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, role: true, createdAt: true },
          },
          membershipPlan: true,
          assignedTrainer: {
            select: { id: true, fullName: true, trainerId: true, specialization: true },
          },
          _count: {
            select: { attendances: true, payments: true, workoutPlans: true },
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('getMembers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch members.', error: error.message });
  }
};

// Get single member details
export const getMemberById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // RBAC check: Members can only see their own profile
    if (req.user?.role === 'MEMBER') {
      const member = await prisma.memberProfile.findUnique({ where: { userId: req.user.id } });
      if (!member || member.id !== id) {
        res.status(403).json({ success: false, message: 'Forbidden: You can only view your own member profile.' });
        return;
      }
    }

    const member = await prisma.memberProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, role: true, createdAt: true } },
        membershipPlan: true,
        assignedTrainer: true,
        attendances: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          include: { membershipPlan: true },
        },
        workoutPlans: {
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!member) {
      res.status(404).json({ success: false, message: 'Member not found.' });
      return;
    }

    res.status(200).json({ success: true, data: member });
  } catch (error: any) {
    console.error('getMemberById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch member details.' });
  }
};

// Create new member (Admin)
export const createMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      password = 'Password@123',
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      status = 'ACTIVE',
      membershipPlanId,
      assignedTrainerId,
      startDate,
    } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({ success: false, message: 'Full name, email, and phone are required.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const memberId = await generateMemberId();

    let membershipStartDate = startDate ? new Date(startDate) : new Date();
    let membershipExpiryDate: Date | null = null;

    if (membershipPlanId) {
      const plan = await prisma.membershipPlan.findUnique({ where: { id: membershipPlanId } });
      if (plan) {
        membershipExpiryDate = new Date(membershipStartDate);
        membershipExpiryDate.setMonth(membershipExpiryDate.getMonth() + plan.durationMonths);
      }
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'MEMBER',
        memberProfile: {
          create: {
            memberId,
            fullName,
            phone,
            dateOfBirth: dateOfBirth || null,
            gender: gender || 'Male',
            address: address || null,
            emergencyContact: emergencyContact || null,
            status,
            membershipPlanId: membershipPlanId || null,
            assignedTrainerId: assignedTrainerId || null,
            membershipStartDate: membershipPlanId ? membershipStartDate : null,
            membershipExpiryDate: membershipPlanId ? membershipExpiryDate : null,
          },
        },
      },
      include: {
        memberProfile: {
          include: {
            membershipPlan: true,
            assignedTrainer: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: `Member ${fullName} created successfully with ID ${memberId}.`,
      data: user.memberProfile,
    });
  } catch (error: any) {
    console.error('createMember error:', error);
    res.status(500).json({ success: false, message: 'Failed to create member.', error: error.message });
  }
};

// Update member
export const updateMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      status,
      membershipPlanId,
      assignedTrainerId,
      membershipStartDate,
      membershipExpiryDate,
    } = req.body;

    const existing = await prisma.memberProfile.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Member not found.' });
      return;
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (status !== undefined) updateData.status = status;
    if (assignedTrainerId !== undefined) updateData.assignedTrainerId = assignedTrainerId || null;
    if (membershipPlanId !== undefined) {
      updateData.membershipPlanId = membershipPlanId || null;
      if (membershipPlanId && !membershipExpiryDate) {
        const plan = await prisma.membershipPlan.findUnique({ where: { id: membershipPlanId } });
        if (plan) {
          const start = membershipStartDate ? new Date(membershipStartDate) : new Date();
          updateData.membershipStartDate = start;
          const end = new Date(start);
          end.setMonth(end.getMonth() + plan.durationMonths);
          updateData.membershipExpiryDate = end;
        }
      }
    }

    if (membershipStartDate !== undefined && membershipStartDate) {
      updateData.membershipStartDate = new Date(membershipStartDate);
    }
    if (membershipExpiryDate !== undefined && membershipExpiryDate) {
      updateData.membershipExpiryDate = new Date(membershipExpiryDate);
    }

    const updated = await prisma.memberProfile.update({
      where: { id },
      data: updateData,
      include: {
        membershipPlan: true,
        assignedTrainer: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Member updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    console.error('updateMember error:', error);
    res.status(500).json({ success: false, message: 'Failed to update member.', error: error.message });
  }
};

// Delete member
export const deleteMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const member = await prisma.memberProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!member) {
      res.status(404).json({ success: false, message: 'Member not found.' });
      return;
    }

    // Deleting the user will cascade delete the profile, attendances, payments, etc.
    await prisma.user.delete({
      where: { id: member.userId },
    });

    res.status(200).json({
      success: true,
      message: `Member ${member.fullName} (${member.memberId}) deleted successfully.`,
    });
  } catch (error: any) {
    console.error('deleteMember error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete member.', error: error.message });
  }
};

// Export members to CSV
export const exportMembersCsv = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const members = await prisma.memberProfile.findMany({
      include: {
        user: true,
        membershipPlan: true,
        assignedTrainer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Member ID',
      'Full Name',
      'Email',
      'Phone',
      'Gender',
      'Status',
      'Plan',
      'Assigned Trainer',
      'Start Date',
      'Expiry Date',
      'Registered At',
    ];

    const rows = members.map((m) => [
      `"${m.memberId}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${m.user.email}"`,
      `"${m.phone}"`,
      `"${m.gender || ''}"`,
      `"${m.status}"`,
      `"${m.membershipPlan?.name || 'None'}"`,
      `"${m.assignedTrainer?.fullName || 'Unassigned'}"`,
      `"${m.membershipStartDate ? m.membershipStartDate.toISOString().split('T')[0] : ''}"`,
      `"${m.membershipExpiryDate ? m.membershipExpiryDate.toISOString().split('T')[0] : ''}"`,
      `"${m.createdAt.toISOString().split('T')[0]}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="iron_revolution_members.csv"');
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('exportMembersCsv error:', error);
    res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
};
