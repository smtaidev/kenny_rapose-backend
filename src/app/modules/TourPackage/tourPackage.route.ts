import express from 'express';
import { TourPackageController } from './tourPackage.controller';
import validateRequest from '../../middlewares/validateRequest';
import { 
  createTourPackageZodSchema, 
  updateTourPackageZodSchema,
  createTourPackageWithPhotosZodSchema,
  updateTourPackageWithPhotosZodSchema,
  createTourPackageMixedZodSchema,
  updateTourPackageMixedZodSchema,
  deletePhotosZodSchema
} from './tourPackage.validation';
import auth, { requireAdmin } from '../../middlewares/auth';
import upload from '../../middlewares/upload';

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

//=====================Create Tour Package (Admin Only) - Mixed Approach=====================
router.post(
  '/',
  auth,
  requireAdmin,
  upload.array('photos', 5), // Photos as form data - max 5 photos
  validateRequest(createTourPackageMixedZodSchema), // JSON data validation
  TourPackageController.createTourPackage
);

//=====================Update Tour Package (Admin Only) - Mixed Approach=====================
router.patch(
  '/:id',
  auth,
  requireAdmin,
  upload.array('photos', 5), // Photos as form data - max 5 photos
  validateRequest(updateTourPackageMixedZodSchema), // JSON data validation
  TourPackageController.updateTourPackage
);

//=====================Delete Tour Package (Admin Only) - Soft Delete=====================
router.delete(
  '/:id',
  auth,
  requireAdmin,
  TourPackageController.deleteTourPackage
);

//=====================Photo Management Routes (Admin Only)=====================

// Upload additional photos to existing tour package
router.post(
  '/:id/photos',
  auth,
  requireAdmin,
  upload.array('photos', 5), // Allow up to 5 photos
  TourPackageController.uploadPhotos
);

// Replace all photos of tour package
router.put(
  '/:id/photos',
  auth,
  requireAdmin,
  upload.array('photos', 5), // Allow up to 5 photos
  TourPackageController.replacePhotos
);

// Delete specific photos from tour package
router.delete(
  '/:id/photos',
  auth,
  requireAdmin,
  validateRequest(deletePhotosZodSchema),
  TourPackageController.deletePhotos
);

export const TourPackageRoutes = router;
