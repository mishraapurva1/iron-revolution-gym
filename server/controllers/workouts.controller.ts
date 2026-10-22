import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

// ================= WORKOUT TIMETABLE / CLASSES =================

export const getWorkoutClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dayOfWeek } = req.query;
    const where: any = {};
    if (dayOfWeek && dayOfWeek !== 'ALL') {
      where.dayOfWeek = String(dayOfWeek);
    }

    const classes = await prisma.workoutClass.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      include: {
        trainerProfile: {
          select: { id: true, fullName: true, trainerId: true, specialization: true },
        },
      },
    });

    res.status(200).json({ success: true, data: classes });
  } catch (error: any) {
    console.error('getWorkoutClasses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch timetable classes.' });
  }
};

export const createWorkoutClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, trainerProfileId, dayOfWeek, startTime, endTime, maxSlots = 20, description, roomOrArea } = req.body;

    if (!title || !dayOfWeek || !startTime || !endTime) {
      res.status(400).json({ success: false, message: 'Class title, day, start time, and end time are required.' });
      return;
    }

    const newClass = await prisma.workoutClass.create({
      data: {
        title,
        trainerProfileId: trainerProfileId || null,
        dayOfWeek,
        startTime,
        endTime,
        maxSlots: Number(maxSlots),
        description: description || null,
        roomOrArea: roomOrArea || 'Main Fitness Floor',
      },
      include: {
        trainerProfile: true,
      },
    });

    res.status(201).json({ success: true, message: 'Class scheduled successfully.', data: newClass });
  } catch (error: any) {
    console.error('createWorkoutClass error:', error);
    res.status(500).json({ success: false, message: 'Failed to create class.' });
  }
};

export const updateWorkoutClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, trainerProfileId, dayOfWeek, startTime, endTime, maxSlots, description, roomOrArea } = req.body;

    const updated = await prisma.workoutClass.update({
      where: { id },
      data: {
        title,
        trainerProfileId: trainerProfileId || null,
        dayOfWeek,
        startTime,
        endTime,
        maxSlots: maxSlots !== undefined ? Number(maxSlots) : undefined,
        description,
        roomOrArea,
      },
      include: {
        trainerProfile: true,
      },
    });

    res.status(200).json({ success: true, message: 'Class updated.', data: updated });
  } catch (error: any) {
    console.error('updateWorkoutClass error:', error);
    res.status(500).json({ success: false, message: 'Failed to update class.' });
  }
};

export const deleteWorkoutClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.workoutClass.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Class deleted successfully.' });
  } catch (error: any) {
    console.error('deleteWorkoutClass error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete class.' });
  }
};

// ================= INDIVIDUAL WORKOUT PLANS =================

export const getWorkoutPlans = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { memberProfileId } = req.query;
    const where: any = {};

    if (req.user?.role === 'MEMBER') {
      const member = await prisma.memberProfile.findUnique({ where: { userId: req.user.id } });
      if (!member) {
        res.status(404).json({ success: false, message: 'Member profile not found.' });
        return;
      }
      where.memberProfileId = member.id;
    } else if (memberProfileId) {
      where.memberProfileId = String(memberProfileId);
    }

    const plans = await prisma.workoutPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        memberProfile: { select: { id: true, fullName: true, memberId: true } },
        trainerProfile: { select: { id: true, fullName: true, trainerId: true } },
        exercises: {
          orderBy: [{ dayOfWeek: 'asc' }, { order: 'asc' }],
        },
      },
    });

    res.status(200).json({ success: true, data: plans });
  } catch (error: any) {
    console.error('getWorkoutPlans error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch workout plans.' });
  }
};

export const createWorkoutPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, memberProfileId, trainerProfileId, notes, exercises } = req.body;

    if (!title || !memberProfileId) {
      res.status(400).json({ success: false, message: 'Plan title and Member are required.' });
      return;
    }

    let actualTrainerId = trainerProfileId;
    if (req.user?.role === 'TRAINER') {
      const trainer = await prisma.trainerProfile.findUnique({ where: { userId: req.user.id } });
      if (trainer) actualTrainerId = trainer.id;
    }

    const plan = await prisma.workoutPlan.create({
      data: {
        title,
        memberProfileId,
        trainerProfileId: actualTrainerId || null,
        notes: notes || null,
        exercises: {
          create: Array.isArray(exercises)
            ? exercises.map((ex: any, idx: number) => ({
                exerciseName: ex.exerciseName,
                dayOfWeek: ex.dayOfWeek || 'Monday',
                targetMuscle: ex.targetMuscle || 'Full Body',
                sets: Number(ex.sets) || 3,
                reps: String(ex.reps || '10-12'),
                weight: ex.weight || null,
                restSeconds: Number(ex.restSeconds) || 60,
                order: idx + 1,
              }))
            : [],
        },
      },
      include: {
        exercises: true,
        memberProfile: true,
      },
    });

    res.status(201).json({ success: true, message: 'Workout plan assigned successfully.', data: plan });
  } catch (error: any) {
    console.error('createWorkoutPlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to create workout plan.' });
  }
};

export const updateWorkoutPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, notes, exercises } = req.body;

    // Delete existing exercises if new list provided and recreate
    if (Array.isArray(exercises)) {
      await prisma.workoutExercise.deleteMany({ where: { workoutPlanId: id } });
    }

    const updated = await prisma.workoutPlan.update({
      where: { id },
      data: {
        title: title || undefined,
        notes: notes !== undefined ? notes : undefined,
        exercises: Array.isArray(exercises)
          ? {
              create: exercises.map((ex: any, idx: number) => ({
                exerciseName: ex.exerciseName,
                dayOfWeek: ex.dayOfWeek || 'Monday',
                targetMuscle: ex.targetMuscle || 'Full Body',
                sets: Number(ex.sets) || 3,
                reps: String(ex.reps || '10-12'),
                weight: ex.weight || null,
                restSeconds: Number(ex.restSeconds) || 60,
                order: idx + 1,
              })),
            }
          : undefined,
      },
      include: {
        exercises: true,
        memberProfile: true,
      },
    });

    res.status(200).json({ success: true, message: 'Workout plan updated.', data: updated });
  } catch (error: any) {
    console.error('updateWorkoutPlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to update plan.' });
  }
};

export const deleteWorkoutPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.workoutPlan.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Workout plan deleted.' });
  } catch (error: any) {
    console.error('deleteWorkoutPlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete plan.' });
  }
};
