import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { paymentValidation } from './payment.validation';
import { CustomWalletTopupController } from './custom-wallet-topup.controller';

const router = Router();

// Custom wallet topup (any amount)
router.post(
  '/custom-wallet-topup',
  auth,
  validateRequest(paymentValidation.createCustomWalletTopupSchema),
  CustomWalletTopupController.createCustomWalletTopup
);

export default router;
