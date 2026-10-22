import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userRole = authReq.user?.role;

    const where: any = {};
    if (userRole !== 'ADMIN') {
      where.isPublished = true;
      if (userRole) {
        where.OR = [{ targetRole: 'ALL' }, { targetRole: userRole }];
      } else {
        where.targetRole = 'ALL';
      }
    }

    const notices = await prisma.notice.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    res.status(200).json({ success: true, data: notices });
  } catch (error: any) {
    console.error('getNotices error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notices.' });
  }
};

export const createNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, content, priority = 'NORMAL', targetRole = 'ALL', isPublished = true } = req.body;

    if (!title || !content) {
      res.status(400).json({ success: false, message: 'Notice title and content are required.' });
      return;
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        priority,
        targetRole,
        isPublished: Boolean(isPublished),
      },
    });

    res.status(201).json({ success: true, message: 'Notice published.', data: notice });
  } catch (error: any) {
    console.error('createNotice error:', error);
    res.status(500).json({ success: false, message: 'Failed to create notice.' });
  }
};

export const updateNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, priority, targetRole, isPublished } = req.body;

    const updated = await prisma.notice.update({
      where: { id },
      data: {
        title,
        content,
        priority,
        targetRole,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
      },
    });

    res.status(200).json({ success: true, message: 'Notice updated.', data: updated });
  } catch (error: any) {
    console.error('updateNotice error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notice.' });
  }
};

export const deleteNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Notice deleted.' });
  } catch (error: any) {
    console.error('deleteNotice error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notice.' });
  }
};
