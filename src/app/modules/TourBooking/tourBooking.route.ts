import express from 'express';
import { TourBookingController } from './tourBooking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createTourBookingZodSchema, updateTourBookingZodSchema } from './tourBooking.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

//=====================Create Tour Booking (Authenticated User)=====================
router.post(
  '/',
  auth,
  validateRequest(createTourBookingZodSchema),
  TourBookingController.createTourBooking
);

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

//=====================Update Tour Booking (Authenticated User)=====================
router.patch(
  '/:id',
  auth,
  validateRequest(updateTourBookingZodSchema),
  TourBookingController.updateTourBooking
);

//=====================Cancel Tour Booking (Authenticated User)=====================
router.patch(
  '/:id/cancel',
  auth,
  TourBookingController.cancelTourBooking
);

//=====================Calculate Cashback (Authenticated User)=====================
router.get(
  '/calculate-cashback',
  auth,
  TourBookingController.calculateCashback
);

export const TourBookingRoutes = router;
