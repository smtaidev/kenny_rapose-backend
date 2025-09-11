import express from 'express';
import { SubscriptionController } from './subscription.controller';
import validateRequest from '../../middlewares/validateRequest';
import { subscribeZodSchema } from './subscription.validation';
import auth, { requireAdmin } from '../../middlewares/auth';

const router = express.Router();

//=====================Subscribe Email (Public)=====================
router.post(
  '/',
  validateRequest(subscribeZodSchema),
  SubscriptionController.subscribe
);

//=====================Get All Subscriptions (Admin Only)=====================
router.get(
  '/all',
  auth,
  requireAdmin,
  SubscriptionController.getAllSubscriptions
);

export const SubscriptionRoutes = router;
