import { Router } from 'express';
import { getGymSettings, updateGymSettings } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// Public can view gym settings (address, hours, contact info)
router.get('/', getGymSettings);

// Admin can update gym settings
router.put('/', authenticate, authorize(['ADMIN']), updateGymSettings);

export default router;
