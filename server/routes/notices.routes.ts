import { Router } from 'express';
import { getNotices, createNotice, updateNotice, deleteNotice } from '../controllers/notices.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// Public & Authenticated can view notices
router.get('/', getNotices);

// Admin can create, update, delete notices
router.post('/', authenticate, authorize(['ADMIN']), createNotice);
router.put('/:id', authenticate, authorize(['ADMIN']), updateNotice);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteNotice);

export default router;
