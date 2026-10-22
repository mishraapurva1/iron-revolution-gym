import { Router } from 'express';
import { getPlans, createPlan, updatePlan, deletePlan } from '../controllers/plans.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// Public can view available plans
router.get('/', getPlans);

// Admin can manage plans
router.post('/', authenticate, authorize(['ADMIN']), createPlan);
router.put('/:id', authenticate, authorize(['ADMIN']), updatePlan);
router.delete('/:id', authenticate, authorize(['ADMIN']), deletePlan);

export default router;
