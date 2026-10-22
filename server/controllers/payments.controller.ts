import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateReceiptNo } from '../utils/idGenerator';

// List payments with search and filtering
export const getPayments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search, method, status, startDate, endDate, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Member can only view their own payments
    if (req.user?.role === 'MEMBER') {
      const member = await prisma.memberProfile.findUnique({ where: { userId: req.user.id } });
      if (!member) {
        res.status(404).json({ success: false, message: 'Member profile not found.' });
        return;
      }
      where.memberProfileId = member.id;
    }

    if (method && method !== 'ALL') {
      where.paymentMethod = method;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (startDate && endDate) {
      where.paymentDate = {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate) + 'T23:59:59.999Z'),
      };
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { receiptNo: { contains: q } },
        { memberProfile: { fullName: { contains: q } } },
        { memberProfile: { memberId: { contains: q } } },
      ];
    }

    const [total, payments, aggregate] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { paymentDate: 'desc' },
        include: {
          memberProfile: {
            select: { id: true, memberId: true, fullName: true, phone: true },
          },
          membershipPlan: {
            select: { id: true, name: true, price: true },
          },
        },
      }),
      prisma.payment.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: payments,
      totalCollected: aggregate._sum.amount || 0,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('getPayments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment records.' });
  }
};

// Record a payment (Admin only)
export const createPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { memberProfileId, membershipPlanId, amount, paymentMethod = 'UPI', paymentDate, status = 'PAID', notes } = req.body;

    if (!memberProfileId || amount === undefined || Number(amount) <= 0) {
      res.status(400).json({ success: false, message: 'Member and a valid positive amount are required.' });
      return;
    }

    const member = await prisma.memberProfile.findUnique({
      where: { id: memberProfileId },
      include: { membershipPlan: true },
    });

    if (!member) {
      res.status(404).json({ success: false, message: 'Member not found.' });
      return;
    }

    const receiptNo = await generateReceiptNo();
    const effectivePlanId = membershipPlanId || member.membershipPlanId;

    const payment = await prisma.payment.create({
      data: {
        receiptNo,
        memberProfileId,
        membershipPlanId: effectivePlanId || null,
        amount: Number(amount),
        paymentMethod,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        status,
        notes: notes || null,
        recordedBy: req.user?.fullName || 'Admin',
      },
      include: {
        memberProfile: true,
        membershipPlan: true,
      },
    });

    // If payment activates or extends membership, update member status to ACTIVE
    if (member.status === 'PENDING' || member.status === 'EXPIRED') {
      await prisma.memberProfile.update({
        where: { id: memberProfileId },
        data: { status: 'ACTIVE' },
      });
    }

    res.status(201).json({
      success: true,
      message: `Payment of ₹${amount} recorded successfully. Receipt No: ${receiptNo}`,
      data: payment,
    });
  } catch (error: any) {
    console.error('createPayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to record payment.', error: error.message });
  }
};

// Get single receipt details for printable invoice
export const getReceipt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        memberProfile: {
          include: {
            user: { select: { email: true } },
          },
        },
        membershipPlan: true,
      },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Receipt not found.' });
      return;
    }

    // RBAC: Member can only view their own receipt
    if (req.user?.role === 'MEMBER' && req.user.memberProfileId !== payment.memberProfileId) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this receipt.' });
      return;
    }

    // Get gym details
    const settings = await prisma.gymSetting.findUnique({ where: { id: 'default-gym-settings' } });

    res.status(200).json({
      success: true,
      receipt: {
        ...payment,
        gym: settings || {
          gymName: 'IRON REVOLUTION',
          ownerName: 'Sachin Patel',
          developerName: 'Apurva Mishra',
          locationAddress: 'Naroli, Silvassa, Dadra and Nagar Haveli, India — 396235',
          phone: '+91 98765 43210',
          email: 'info@ironrevolution.demo',
        },
      },
    });
  } catch (error: any) {
    console.error('getReceipt error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve receipt.' });
  }
};

// Export payments to CSV
export const exportPaymentsCsv = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        memberProfile: true,
        membershipPlan: true,
      },
      orderBy: { paymentDate: 'desc' },
    });

    const headers = [
      'Receipt No',
      'Member ID',
      'Member Name',
      'Plan',
      'Amount (INR)',
      'Payment Method',
      'Status',
      'Payment Date',
      'Recorded By',
    ];

    const rows = payments.map((p) => [
      `"${p.receiptNo}"`,
      `"${p.memberProfile.memberId}"`,
      `"${p.memberProfile.fullName.replace(/"/g, '""')}"`,
      `"${p.membershipPlan?.name || 'General'}"`,
      p.amount,
      `"${p.paymentMethod}"`,
      `"${p.status}"`,
      `"${p.paymentDate.toISOString().split('T')[0]}"`,
      `"${p.recordedBy || 'System'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="iron_revolution_payments.csv"');
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('exportPaymentsCsv error:', error);
    res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
};
