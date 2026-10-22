import { Router } from 'express';
import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from '../controllers/trainers.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// Public can view trainers list and profile
router.get('/', getTrainers);
router.get('/:id', getTrainerById);

// Staff actions
router.post('/', authenticate, authorize(['ADMIN']), createTrainer);
router.put('/:id', authenticate, authorize(['ADMIN']), updateTrainer);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteTrainer);

export default router;
