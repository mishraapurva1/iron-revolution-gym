import { Router } from 'express';
import {
  getPayments,
  createPayment,
  getReceipt,
  exportPaymentsCsv,
} from '../controllers/payments.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/export/csv', authorize(['ADMIN']), exportPaymentsCsv);
router.get('/', authorize(['ADMIN', 'MEMBER']), getPayments);
router.get('/:id/receipt', authorize(['ADMIN', 'MEMBER']), getReceipt);
router.post('/', authorize(['ADMIN']), createPayment);

export default router;
