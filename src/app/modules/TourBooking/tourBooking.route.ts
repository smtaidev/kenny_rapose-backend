import express from 'express';
import { TourBookingController } from './tourBooking.controller';
import auth, { requireAdmin } from '../../middlewares/auth';

const router = express.Router();

//=====================Get User Tour Bookings (Authenticated User)=====================
router.get(
  '/',
  auth,
  TourBookingController.getUserTourBookings
);

//=====================Get Tour Booking by ID (Authenticated User)=====================
router.get(
  '/:id',
  auth,
  TourBookingController.getTourBookingById
);

//=====================Cancel Tour Booking (Admin Only)=====================
router.patch(
  '/:id/cancel',
  auth,
  requireAdmin,
  TourBookingController.cancelTourBooking
);

//=====================Calculate Cashback (Authenticated User)=====================
router.get(
  '/calculate-cashback',
  auth,
  TourBookingController.calculateCashback
);

export const TourBookingRoutes = router;
