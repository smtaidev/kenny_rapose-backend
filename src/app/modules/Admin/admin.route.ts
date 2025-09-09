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

//=====================Get Tour Package Analytics=====================
router.get(
  '/tour-package-analytics',
  auth,
  requireAdmin,
  AdminController.getTourPackageAnalytics
);

//=====================Get Cancel Request Statistics=====================
router.get(
  '/cancel-request-stats',
  auth,
  requireAdmin,
  AdminController.getCancelRequestStats
);

//=====================Get All Cancel Requests with Details=====================
router.get(
  '/cancel-requests',
  auth,
  requireAdmin,
  AdminController.getAllCancelRequestsWithDetails
);

export const AdminRoutes = router;
