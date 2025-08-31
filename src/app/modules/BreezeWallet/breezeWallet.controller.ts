import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BreezeWalletService } from './breezeWallet.service';
import httpStatus from 'http-status';

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

//=====================Get All Breeze Wallet Packages=====================
const getAllBreezeWalletPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await BreezeWalletService.getAllBreezeWalletPackages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Breeze Wallet Packages retrieved successfully',
    data: result,
  });
});

//=====================Get User's Breeze Wallet Balance=====================
const getWalletBalance = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await BreezeWalletService.getWalletBalance(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wallet balance retrieved successfully',
    data: result,
  });
});

export const BreezeWalletController = {
  createBreezeWalletPackage,
  updateBreezeWalletPackage,
  deleteBreezeWalletPackage,
  getBreezeWalletPackageById,
  getAllBreezeWalletPackages,
  getWalletBalance,
};
