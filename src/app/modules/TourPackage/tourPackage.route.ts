import express from 'express';
import { TourPackageController } from './tourPackage.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createTourPackageZodSchema, updateTourPackageZodSchema } from './tourPackage.validation';
import auth, { requireAdmin } from '../../middlewares/auth';

const router = express.Router();

//=====================Get All Tour Packages (Public)=====================
router.get(
  '/',
  TourPackageController.getAllTourPackages
);

//=====================Get Tour Package by ID (Public)=====================
router.get(
  '/:id',
  TourPackageController.getTourPackageById
);

//=====================Create Tour Package (Admin Only)=====================
router.post(
  '/',
  auth,
  requireAdmin,
  validateRequest(createTourPackageZodSchema),
  TourPackageController.createTourPackage
);

//=====================Update Tour Package (Admin Only)=====================
router.patch(
  '/:id',
  auth,
  requireAdmin,
  validateRequest(updateTourPackageZodSchema),
  TourPackageController.updateTourPackage
);

//=====================Delete Tour Package (Admin Only) - Soft Delete=====================
router.delete(
  '/:id',
  auth,
  requireAdmin,
  TourPackageController.deleteTourPackage
);

export const TourPackageRoutes = router;
