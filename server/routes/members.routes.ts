import { Router } from 'express';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  exportMembersCsv,
} from '../controllers/members.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/export/csv', authorize(['ADMIN']), exportMembersCsv);
router.get('/', authorize(['ADMIN', 'TRAINER']), getMembers);
router.get('/:id', authorize(['ADMIN', 'TRAINER', 'MEMBER']), getMemberById);
router.post('/', authorize(['ADMIN']), createMember);
router.put('/:id', authorize(['ADMIN']), updateMember);
router.delete('/:id', authorize(['ADMIN']), deleteMember);

export default router;
