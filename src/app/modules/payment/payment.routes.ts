import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { paymentValidation } from './payment.validation';

const router = express.Router();

// Create checkout session for AI credit purchase
router.post(
  '/create-checkout-session',
  auth,
  validateRequest(paymentValidation.createCheckoutSessionSchema),
  PaymentController.createCheckoutSession
);

// Stripe webhook (no auth required - Stripe will call this)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Raw body for webhook signature verification
  PaymentController.handleWebhook
);

// Get user's payment history
router.get(
  '/history',
  auth,
  PaymentController.getPaymentHistory
);

// Get specific payment details
router.get(
  '/:paymentId',
  auth,
  PaymentController.getPaymentById
);

// Get payment details by session ID
router.get(
  '/session/:sessionId',
  auth,
  PaymentController.getPaymentBySessionId
);

export const paymentRouter = router;
