import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BreezeWalletService } from './breezeWallet.service';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import AppError from '../../errors/AppError';

//=====================Create Breeze Wallet Package=====================
const createBreezeWalletPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await BreezeWalletService.createBreezeWalletPackage(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Breeze Wallet Package created successfully',
    data: result,
  });
});

//=====================Update Breeze Wallet Package=====================
const updateBreezeWalletPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BreezeWalletService.updateBreezeWalletPackage(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Breeze Wallet Package updated successfully',
    data: result,
  });
});

//=====================Reactivate Breeze Wallet Package=====================
const reactivateBreezeWalletPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BreezeWalletService.reactivateBreezeWalletPackage(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Breeze Wallet Package reactivated successfully',
    data: result,
  });
});

//=====================Delete Breeze Wallet Package=====================
const deleteBreezeWalletPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BreezeWalletService.deleteBreezeWalletPackage(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Breeze Wallet Package deleted successfully',
    data: result,
  });
});

//=====================Get Breeze Wallet Package by ID=====================
const getBreezeWalletPackageById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BreezeWalletService.getBreezeWalletPackageById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Breeze Wallet Package retrieved successfully',
    data: result,
  });
});

//=====================Get All Breeze Wallet Packages (Admin Only)=====================
const getAllBreezeWalletPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await BreezeWalletService.getAllBreezeWalletPackages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Breeze Wallet Packages retrieved successfully',
    data: result,
  });
});

//=====================Get All Breeze Wallet Packages (Public)=====================
const getAllActiveBreezeWalletPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await BreezeWalletService.getAllActiveBreezeWalletPackages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Breeze Wallet Packages retrieved successfully',
    data: result,
  });
});

//=====================Get User's Breeze Wallet Balance=====================
const getWalletBalance = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BreezeWalletService.getWalletBalance(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wallet balance retrieved successfully',
    data: result,
  });
});

//=====================Get Simple Wallet Top-up History=====================
const getSimpleWalletTopUpHistory = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { page = 1, limit = 20 } = req.query;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BreezeWalletService.getSimpleWalletTopUpHistory(
    userId, 
    Number(page), 
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wallet top-up history retrieved successfully',
    data: result,
  });
});

//=====================Convert AI Credits to Wallet Balance=====================
const convertCreditsToWallet = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { creditsToConvert } = req.body;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (!creditsToConvert) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Credits to convert is required');
  }

  const result = await BreezeWalletService.convertCreditsToWallet(userId, creditsToConvert);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Credits converted to wallet balance successfully',
    data: result,
  });
});

export const BreezeWalletController = {
  createBreezeWalletPackage,
  updateBreezeWalletPackage,
  reactivateBreezeWalletPackage,
  deleteBreezeWalletPackage,
  getBreezeWalletPackageById,
  getAllBreezeWalletPackages,
  getAllActiveBreezeWalletPackages,
  getWalletBalance,
  getSimpleWalletTopUpHistory,
  convertCreditsToWallet,
};
