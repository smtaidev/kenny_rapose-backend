import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AiCreditPackageService } from './aiCreditPackage.service';
import httpStatus from 'http-status';

//=====================Create AI Credit Package=====================
const createAiCreditPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await AiCreditPackageService.createAiCreditPackage(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'AI Credit Package created successfully',
    data: result,
  });
});

//=====================Update AI Credit Package=====================
const updateAiCreditPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AiCreditPackageService.updateAiCreditPackage(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI Credit Package updated successfully',
    data: result,
  });
});

//=====================Delete AI Credit Package=====================
const deleteAiCreditPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AiCreditPackageService.deleteAiCreditPackage(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI Credit Package deleted successfully',
    data: result,
  });
});

//=====================Get AI Credit Package by ID=====================
const getAiCreditPackageById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AiCreditPackageService.getAiCreditPackageById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI Credit Package retrieved successfully',
    data: result,
  });
});

//=====================Get All AI Credit Packages=====================
const getAllAiCreditPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await AiCreditPackageService.getAllAiCreditPackages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI Credit Packages retrieved successfully',
    data: result,
  });
});

export const AiCreditPackageController = {
  createAiCreditPackage,
  updateAiCreditPackage,
  deleteAiCreditPackage,
  getAiCreditPackageById,
  getAllAiCreditPackages,
};
