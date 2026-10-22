import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

// List membership plans
export const getPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await prisma.membershipPlan.findMany({
      orderBy: { durationMonths: 'asc' },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    res.status(200).json({ success: true, data: plans });
  } catch (error: any) {
    console.error('getPlans error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch membership plans.' });
  }
};

// Create plan (Admin)
export const createPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description, durationMonths, price, benefits, isActive = true } = req.body;

    if (!name || !durationMonths || price === undefined) {
      res.status(400).json({ success: false, message: 'Plan name, duration, and price are required.' });
      return;
    }

    const existing = await prisma.membershipPlan.findUnique({ where: { name: name.trim() } });
    if (existing) {
      res.status(400).json({ success: false, message: 'A membership plan with this name already exists.' });
      return;
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name: name.trim(),
        description: description || '',
        durationMonths: Number(durationMonths),
        price: Number(price),
        benefits: typeof benefits === 'string' ? benefits : JSON.stringify(benefits || []),
        isActive: Boolean(isActive),
      },
    });

    res.status(201).json({ success: true, message: 'Membership plan created.', data: plan });
  } catch (error: any) {
    console.error('createPlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to create plan.' });
  }
};

// Update plan
export const updatePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, durationMonths, price, benefits, isActive } = req.body;

    const plan = await prisma.membershipPlan.findUnique({ where: { id } });
    if (!plan) {
      res.status(404).json({ success: false, message: 'Membership plan not found.' });
      return;
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (durationMonths !== undefined) updateData.durationMonths = Number(durationMonths);
    if (price !== undefined) updateData.price = Number(price);
    if (benefits !== undefined) updateData.benefits = typeof benefits === 'string' ? benefits : JSON.stringify(benefits);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await prisma.membershipPlan.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, message: 'Plan updated.', data: updated });
  } catch (error: any) {
    console.error('updatePlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to update plan.' });
  }
};

// Delete plan
export const deletePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const memberCount = await prisma.memberProfile.count({ where: { membershipPlanId: id } });
    if (memberCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete plan: ${memberCount} active members are currently assigned to it. Deactivate the plan instead.`,
      });
      return;
    }

    await prisma.membershipPlan.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Plan deleted successfully.' });
  } catch (error: any) {
    console.error('deletePlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete plan.' });
  }
};
