import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    // 1. Total & Active members
    const [totalMembers, activeMembers, totalTrainers, paymentsAgg] = await Promise.all([
      prisma.memberProfile.count(),
      prisma.memberProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.trainerProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
    ]);

    // 2. Expiring memberships (status is ACTIVE or EXPIRED and expiry <= nextWeek)
    const expiringMemberships = await prisma.memberProfile.findMany({
      where: {
        membershipExpiryDate: {
          lte: nextWeek,
        },
      },
      include: {
        membershipPlan: { select: { name: true } },
      },
      orderBy: { membershipExpiryDate: 'asc' },
      take: 5,
    });

    const expiringCount = await prisma.memberProfile.count({
      where: {
        membershipExpiryDate: {
          lte: nextWeek,
        },
      },
    });

    // 3. Today's attendance
    const todayAttendanceCount = await prisma.attendance.count({
      where: {
        date: todayStr,
        status: 'PRESENT',
      },
    });

    // 4. Recent registrations
    const recentMembers = await prisma.memberProfile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        membershipPlan: { select: { name: true } },
        assignedTrainer: { select: { fullName: true } },
      },
    });

    // 5. Recent payments
    const recentPayments = await prisma.payment.findMany({
      orderBy: { paymentDate: 'desc' },
      take: 5,
      include: {
        memberProfile: { select: { fullName: true, memberId: true } },
        membershipPlan: { select: { name: true } },
      },
    });

    // 6. Membership plan distribution
    const plans = await prisma.membershipPlan.findMany({
      include: {
        _count: { select: { members: true } },
      },
    });

    const planDistribution = plans.map((p) => ({
      name: p.name,
      value: p._count.members,
      price: p.price,
    }));

    // 7. Monthly registrations & revenue (derived from DB)
    // We can aggregate past 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats: { month: string; members: number; revenue: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const [mCount, pSum] = await Promise.all([
        prisma.memberProfile.count({
          where: {
            createdAt: { gte: d, lt: nextMonth },
          },
        }),
        prisma.payment.aggregate({
          where: {
            paymentDate: { gte: d, lt: nextMonth },
          },
          _sum: { amount: true },
        }),
      ]);

      monthlyStats.push({
        month: monthNames[d.getMonth()],
        members: mCount,
        revenue: pSum._sum.amount || 0,
      });
    }

    // 8. Weekly attendance trend (past 7 days)
    const attendanceTrends: { date: string; day: string; count: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const dateStr = targetDate.toISOString().split('T')[0];

      const count = await prisma.attendance.count({
        where: {
          date: dateStr,
          status: 'PRESENT',
        },
      });

      attendanceTrends.push({
        date: dateStr,
        day: dayNames[targetDate.getDay()],
        count,
      });
    }

    res.status(200).json({
      success: true,
      summary: {
        totalMembers,
        activeMembers,
        totalTrainers,
        expiringCount,
        todayAttendance: todayAttendanceCount,
        totalRevenue: paymentsAgg._sum.amount || 0,
      },
      charts: {
        monthlyStats,
        planDistribution,
        attendanceTrends,
      },
      recentMembers,
      recentPayments,
      expiringMemberships,
    });
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics.' });
  }
};
