import express from 'express';
import { BreezeWalletController } from './breezeWallet.controller';
import validateRequest from '../../middlewares/validateRequest';
import { 
  createBreezeWalletPackageZodSchema, 
  updateBreezeWalletPackageZodSchema,
  topUpWalletZodSchema,
  getWalletBalanceZodSchema
} from './breezeWallet.validation';
import auth, { requireAdmin } from '../../middlewares/auth';

const router = express.Router();

//=====================Get All Breeze Wallet Packages (Public)=====================
router.get(
  '/packages',
  BreezeWalletController.getAllBreezeWalletPackages
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

//=====================Delete Breeze Wallet Package (Admin Only)=====================
router.delete(
  '/packages/:id',
  auth,
  requireAdmin,
  BreezeWalletController.deleteBreezeWalletPackage
);

//=====================Top Up User's Breeze Wallet (Authenticated User)=====================
router.post(
  '/top-up',
  auth,
  validateRequest(topUpWalletZodSchema),
  BreezeWalletController.topUpWallet
);

//=====================Get User's Breeze Wallet Balance (Authenticated User)=====================
router.get(
  '/balance/:userId',
  auth,
  validateRequest(getWalletBalanceZodSchema),
  BreezeWalletController.getWalletBalance
);

export const BreezeWalletRoutes = router;
