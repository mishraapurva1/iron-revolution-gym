import { Router } from 'express';
import {
  recordAttendance,
  batchRecordAttendance,
  getAttendanceByDate,
  getMemberAttendanceHistory,
  updateAttendance,
} from '../controllers/attendance.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

// Admin & Trainer can view date attendance & record
router.get('/', authorize(['ADMIN', 'TRAINER']), getAttendanceByDate);
router.post('/', authorize(['ADMIN', 'TRAINER']), recordAttendance);
router.post('/batch', authorize(['ADMIN', 'TRAINER']), batchRecordAttendance);
router.put('/:id', authorize(['ADMIN', 'TRAINER']), updateAttendance);

// Individual attendance history (Member can view their own, Admin/Trainer can view anyone's)
router.get('/member/:memberId', authorize(['ADMIN', 'TRAINER', 'MEMBER']), getMemberAttendanceHistory);

export default router;
