import express from 'express';
import { AiCreditPackageController } from './aiCreditPackage.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAiCreditPackageZodSchema, updateAiCreditPackageZodSchema } from './aiCreditPackage.validation';
import auth, { requireAdmin } from '../../middlewares/auth';

const router = express.Router();

//=====================Get All AI Credit Packages (Public)=====================
router.get(
  '/',
  AiCreditPackageController.getAllAiCreditPackages
);

//=====================Get AI Credit Package by ID (Public)=====================
router.get(
  '/:id',
  AiCreditPackageController.getAiCreditPackageById
);

//=====================Create AI Credit Package (Admin Only)=====================
router.post(
  '/',
  auth,
  requireAdmin,
  validateRequest(createAiCreditPackageZodSchema),
  AiCreditPackageController.createAiCreditPackage
);

//=====================Update AI Credit Package (Admin Only)=====================
router.patch(
  '/:id',
  auth,
  requireAdmin,
  validateRequest(updateAiCreditPackageZodSchema),
  AiCreditPackageController.updateAiCreditPackage
);

//=====================Delete AI Credit Package (Admin Only)=====================
router.delete(
  '/:id',
  auth,
  requireAdmin,
  AiCreditPackageController.deleteAiCreditPackage
);

export const AiCreditPackageRoutes = router;
