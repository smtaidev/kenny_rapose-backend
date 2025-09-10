import { Router } from 'express';
import { UploadController } from './upload.controller';
import { 
  generatePresignedUrlZodSchema, 
  deletePhotoZodSchema, 
  deleteMultiplePhotosZodSchema 
} from './upload.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = Router();

// Generate presigned URL for photo upload
router.post(
  '/generate-presigned-url',
  auth, // Require authentication
  validateRequest(generatePresignedUrlZodSchema),
  UploadController.generatePresignedUrl
);

// Delete single photo
router.delete(
  '/delete-photo',
  auth, // Require authentication
  validateRequest(deletePhotoZodSchema),
  UploadController.deletePhoto
);

// Delete multiple photos
router.delete(
  '/delete-multiple-photos',
  auth, // Require authentication
  validateRequest(deleteMultiplePhotosZodSchema),
  UploadController.deleteMultiplePhotos
);

export const UploadRoutes = router;
