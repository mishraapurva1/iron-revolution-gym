import { Router } from 'express';
import { getDashboardStats } from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/dashboard', authorize(['ADMIN']), getDashboardStats);

export default router;
