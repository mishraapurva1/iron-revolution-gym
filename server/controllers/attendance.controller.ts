import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

// Record attendance
export const recordAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { memberProfileId, date, checkInTime, status = 'PRESENT', notes } = req.body;

    if (!memberProfileId || !date) {
      res.status(400).json({ success: false, message: 'Member ID and date (YYYY-MM-DD) are required.' });
      return;
    }

    // Check duplicate attendance for member on this date
    const existing = await prisma.attendance.findUnique({
      where: {
        memberProfileId_date: {
          memberProfileId,
          date,
        },
      },
      include: {
        memberProfile: { select: { fullName: true, memberId: true } },
      },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Attendance already recorded for ${existing.memberProfile.fullName} on ${date} (Status: ${existing.status}).`,
        data: existing,
      });
      return;
    }

    // Default time if PRESENT and not supplied
    const timeFormatted = checkInTime || new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const attendance = await prisma.attendance.create({
      data: {
        memberProfileId,
        date,
        checkInTime: status === 'PRESENT' ? timeFormatted : null,
        status,
        notes: notes || null,
      },
      include: {
        memberProfile: {
          select: { id: true, memberId: true, fullName: true, phone: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: `Attendance recorded for ${attendance.memberProfile.fullName}.`,
      data: attendance,
    });
  } catch (error: any) {
    console.error('recordAttendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to record attendance.', error: error.message });
  }
};

// Batch record attendance (e.g. marking multiple members present/absent for today)
export const batchRecordAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { date, records } = req.body; // records: [{ memberProfileId, status, checkInTime }]

    if (!date || !Array.isArray(records)) {
      res.status(400).json({ success: false, message: 'Date and records array are required.' });
      return;
    }

    let successCount = 0;
    let skippedCount = 0;

    for (const rec of records) {
      const existing = await prisma.attendance.findUnique({
        where: {
          memberProfileId_date: {
            memberProfileId: rec.memberProfileId,
            date,
          },
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      await prisma.attendance.create({
        data: {
          memberProfileId: rec.memberProfileId,
          date,
          checkInTime: rec.status === 'PRESENT' ? (rec.checkInTime || '06:00 AM') : null,
          status: rec.status || 'PRESENT',
        },
      });
      successCount++;
    }

    res.status(200).json({
      success: true,
      message: `Batch attendance processed: ${successCount} marked, ${skippedCount} already existed.`,
      summary: { successCount, skippedCount },
    });
  } catch (error: any) {
    console.error('batchRecordAttendance error:', error);
    res.status(500).json({ success: false, message: 'Batch recording failed.' });
  }
};

// Get attendance for a specific date or range
export const getAttendanceByDate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { date, search } = req.query;
    const queryDate = (date as string) || new Date().toISOString().split('T')[0];

    const where: any = { date: queryDate };

    if (search) {
      const q = String(search).trim();
      where.memberProfile = {
        OR: [
          { fullName: { contains: q } },
          { memberId: { contains: q } },
        ],
      };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        memberProfile: {
          select: {
            id: true,
            memberId: true,
            fullName: true,
            phone: true,
            status: true,
            membershipPlan: { select: { name: true } },
          },
        },
      },
    });

    // Summary stats for this date
    const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
    const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;
    const totalMembers = await prisma.memberProfile.count({ where: { status: 'ACTIVE' } });

    res.status(200).json({
      success: true,
      date: queryDate,
      summary: {
        presentCount,
        absentCount,
        totalActiveMembers: totalMembers,
        attendanceRate: totalMembers > 0 ? Math.round((presentCount / totalMembers) * 100) : 0,
      },
      data: attendances,
    });
  } catch (error: any) {
    console.error('getAttendanceByDate error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance.' });
  }
};

// Get individual member's attendance history and percentage
export const getMemberAttendanceHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { memberId } = req.params;

    // RBAC check: Members can only see their own attendance
    if (req.user?.role === 'MEMBER') {
      const currentMember = await prisma.memberProfile.findUnique({ where: { userId: req.user.id } });
      if (!currentMember || currentMember.id !== memberId) {
        res.status(403).json({ success: false, message: 'Forbidden: You can only view your own attendance.' });
        return;
      }
    }

    const history = await prisma.attendance.findMany({
      where: { memberProfileId: memberId },
      orderBy: { date: 'desc' },
    });

    const totalRecorded = history.length;
    const totalPresent = history.filter((a) => a.status === 'PRESENT').length;
    const attendancePercentage = totalRecorded > 0 ? Math.round((totalPresent / totalRecorded) * 100) : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalRecorded,
        totalPresent,
        totalAbsent: totalRecorded - totalPresent,
        attendancePercentage,
      },
      data: history,
    });
  } catch (error: any) {
    console.error('getMemberAttendanceHistory error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve attendance history.' });
  }
};

// Update attendance record
export const updateAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, checkInTime, notes } = req.body;

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        checkInTime: status === 'PRESENT' ? checkInTime : null,
        notes,
      },
    });

    res.status(200).json({ success: true, message: 'Attendance updated.', data: updated });
  } catch (error: any) {
    console.error('updateAttendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to update attendance.' });
  }
};
