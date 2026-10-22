import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateTrainerId } from '../utils/idGenerator';

// Get list of trainers
export const getTrainers = async (req: Request, res: Response): Promise<void> => {
  try {
    const trainers = await prisma.trainerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, role: true } },
        assignedMembers: {
          select: { id: true, memberId: true, fullName: true, status: true, phone: true },
        },
        workoutClasses: true,
      },
    });

    res.status(200).json({ success: true, data: trainers });
  } catch (error: any) {
    console.error('getTrainers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch trainers.' });
  }
};

// Get single trainer details
export const getTrainerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trainer = await prisma.trainerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, role: true } },
        assignedMembers: {
          include: {
            membershipPlan: true,
          },
        },
        workoutClasses: true,
        workoutPlans: {
          include: {
            memberProfile: true,
          },
        },
      },
    });

    if (!trainer) {
      res.status(404).json({ success: false, message: 'Trainer not found.' });
      return;
    }

    res.status(200).json({ success: true, data: trainer });
  } catch (error: any) {
    console.error('getTrainerById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch trainer details.' });
  }
};

// Create new trainer (Admin only)
export const createTrainer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      password = 'Trainer@123',
      specialization,
      experienceYears = 2,
      bio,
      photoUrl,
      status = 'ACTIVE',
    } = req.body;

    if (!fullName || !email || !phone || !specialization) {
      res.status(400).json({
        success: false,
        message: 'Full name, email, phone, and specialization are required.',
      });
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
    const trainerId = await generateTrainerId();

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'TRAINER',
        trainerProfile: {
          create: {
            trainerId,
            fullName,
            phone,
            specialization,
            experienceYears: Number(experienceYears),
            bio: bio || null,
            photoUrl: photoUrl || null,
            status,
          },
        },
      },
      include: {
        trainerProfile: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Trainer ${fullName} created successfully with ID ${trainerId}.`,
      data: user.trainerProfile,
    });
  } catch (error: any) {
    console.error('createTrainer error:', error);
    res.status(500).json({ success: false, message: 'Failed to create trainer.', error: error.message });
  }
};

// Update trainer
export const updateTrainer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, phone, specialization, experienceYears, bio, photoUrl, status } = req.body;

    const trainer = await prisma.trainerProfile.findUnique({ where: { id } });
    if (!trainer) {
      res.status(404).json({ success: false, message: 'Trainer not found.' });
      return;
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (experienceYears !== undefined) updateData.experienceYears = Number(experienceYears);
    if (bio !== undefined) updateData.bio = bio;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.trainerProfile.update({
      where: { id },
      data: updateData,
      include: {
        workoutClasses: true,
        assignedMembers: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Trainer updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    console.error('updateTrainer error:', error);
    res.status(500).json({ success: false, message: 'Failed to update trainer.' });
  }
};

// Delete trainer
export const deleteTrainer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trainer = await prisma.trainerProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!trainer) {
      res.status(404).json({ success: false, message: 'Trainer not found.' });
      return;
    }

    await prisma.user.delete({
      where: { id: trainer.userId },
    });

    res.status(200).json({
      success: true,
      message: `Trainer ${trainer.fullName} (${trainer.trainerId}) deleted successfully.`,
    });
  } catch (error: any) {
    console.error('deleteTrainer error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete trainer.' });
  }
};
