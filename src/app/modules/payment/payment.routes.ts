import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { paymentValidation } from './payment.validation';
import customWalletTopupRoutes from './custom-wallet-topup.routes';
import stripeCustomWalletTopupRoutes from './stripe-custom-wallet-topup.routes';

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

// PayPal routes
// Create PayPal order
router.post(
  '/paypal/create-order',
  auth,
  validateRequest(paymentValidation.createCheckoutSessionSchema), // Reuse same validation
  PaymentController.createPayPalOrder
);

// PayPal webhook (no auth required - PayPal will call this)
router.post(
  '/paypal/webhook',
  express.json(), // JSON body for PayPal webhook
  PaymentController.handlePayPalWebhook
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

// Custom wallet topup routes
router.use('/paypal', customWalletTopupRoutes);
router.use('/stripe', stripeCustomWalletTopupRoutes);

export const paymentRouter = router;
