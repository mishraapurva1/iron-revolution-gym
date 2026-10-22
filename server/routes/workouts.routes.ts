import { Router } from 'express';
import {
  getWorkoutClasses,
  createWorkoutClass,
  updateWorkoutClass,
  deleteWorkoutClass,
  getWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from '../controllers/workouts.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// Timetable classes (Public & Authenticated)
router.get('/classes', getWorkoutClasses);
router.post('/classes', authenticate, authorize(['ADMIN']), createWorkoutClass);
router.put('/classes/:id', authenticate, authorize(['ADMIN']), updateWorkoutClass);
router.delete('/classes/:id', authenticate, authorize(['ADMIN']), deleteWorkoutClass);

// Individual Workout plans
router.get('/plans', authenticate, authorize(['ADMIN', 'TRAINER', 'MEMBER']), getWorkoutPlans);
router.post('/plans', authenticate, authorize(['ADMIN', 'TRAINER']), createWorkoutPlan);
router.put('/plans/:id', authenticate, authorize(['ADMIN', 'TRAINER']), updateWorkoutPlan);
router.delete('/plans/:id', authenticate, authorize(['ADMIN', 'TRAINER']), deleteWorkoutPlan);

export default router;
