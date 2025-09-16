import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { paymentValidation } from './payment.validation';
import { StripeCustomWalletTopupController } from './stripe-custom-wallet-topup.controller';

const router = Router();

// Stripe custom wallet topup (any amount)
router.post(
  '/custom-wallet-topup',
  auth,
  validateRequest(paymentValidation.createCustomWalletTopupSchema),
  StripeCustomWalletTopupController.createStripeCustomWalletTopup
);

export default router;
