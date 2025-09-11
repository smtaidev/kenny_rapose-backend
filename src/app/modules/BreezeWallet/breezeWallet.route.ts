import express from 'express';
import { BreezeWalletController } from './breezeWallet.controller';
import validateRequest from '../../middlewares/validateRequest';
import { 
  createBreezeWalletPackageZodSchema, 
  updateBreezeWalletPackageZodSchema,
  convertCreditsToWalletZodSchema
} from './breezeWallet.validation';
import auth, { requireAdmin } from '../../middlewares/auth';

const router = express.Router();

//=====================Get All Breeze Wallet Packages (Admin Only)=====================
router.get(
  '/packages',
  auth,
  requireAdmin,
  BreezeWalletController.getAllBreezeWalletPackages
);

//=====================Get All Breeze Wallet Packages (Public)=====================
router.get(
  '/packages/public',
  BreezeWalletController.getAllActiveBreezeWalletPackages
);

//=====================Get Breeze Wallet Package by ID (Public)=====================
router.get(
  '/packages/:id',
  BreezeWalletController.getBreezeWalletPackageById
);

//=====================Create Breeze Wallet Package (Admin Only)=====================
router.post(
  '/packages',
  auth,
  requireAdmin,
  validateRequest(createBreezeWalletPackageZodSchema),
  BreezeWalletController.createBreezeWalletPackage
);

//=====================Update Breeze Wallet Package (Admin Only)=====================
router.patch(
  '/packages/:id',
  auth,
  requireAdmin,
  validateRequest(updateBreezeWalletPackageZodSchema),
  BreezeWalletController.updateBreezeWalletPackage
);

//=====================Reactivate Breeze Wallet Package (Admin Only)=====================
router.patch(
  '/packages/:id/reactivate',
  auth,
  requireAdmin,
  BreezeWalletController.reactivateBreezeWalletPackage
);

//=====================Delete Breeze Wallet Package (Admin Only)=====================
router.delete(
  '/packages/:id',
  auth,
  requireAdmin,
  BreezeWalletController.deleteBreezeWalletPackage
);

//=====================Get Simple Wallet Top-up History (User Only)=====================
router.get(
  '/topup-history',
  auth,
  BreezeWalletController.getSimpleWalletTopUpHistory
);

//=====================Get User's Breeze Wallet Balance (Authenticated User)=====================
router.get(
  '/balance',
  auth,
  BreezeWalletController.getWalletBalance
);

//=====================Convert AI Credits to Wallet Balance (Authenticated User)=====================
router.post(
  '/convert-credits',
  auth,
  validateRequest(convertCreditsToWalletZodSchema),
  BreezeWalletController.convertCreditsToWallet
);

export const BreezeWalletRoutes = router;
