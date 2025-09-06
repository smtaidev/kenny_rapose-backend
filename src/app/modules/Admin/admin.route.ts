import express from 'express';
import { AdminController } from './admin.controller';
import auth, { requireAdmin } from '../../middlewares/auth';

const router = express.Router();

//=====================Admin Routes=====================

//=====================Get Dashboard Statistics=====================
router.get(
  '/dashboard',
  auth,
  requireAdmin,
  AdminController.getDashboardStats
);

//=====================Get Users by Country Statistics=====================
router.get(
  '/users-by-country',
  auth,
  requireAdmin,
  AdminController.getUsersByCountry
);

//=====================Get Tour Bookings per Month=====================
router.get(
  '/tour-bookings-per-month',
  auth,
  requireAdmin,
  AdminController.getTourBookingsPerMonth
);

//=====================Get All Booked Tour Packages=====================
router.get(
  '/booked-tour-packages',
  auth,
  requireAdmin,
  AdminController.getAllBookedTourPackages
);

export const AdminRoutes = router;
