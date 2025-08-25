import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TourPackageService } from './tourPackage.service';
import httpStatus from 'http-status';

//=====================Create Tour Package=====================
const createTourPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await TourPackageService.createTourPackage(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Tour package created successfully',
    data: result,
  });
});

//=====================Update Tour Package=====================
const updateTourPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourPackageService.updateTourPackage(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour package updated successfully',
    data: result,
  });
});

//=====================Delete Tour Package (Soft Delete)=====================
const deleteTourPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourPackageService.deleteTourPackage(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour package deleted successfully',
    data: result,
  });
});

//=====================Get Tour Package by ID=====================
const getTourPackageById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourPackageService.getTourPackageById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour package retrieved successfully',
    data: result,
  });
});

//=====================Get All Tour Packages=====================
const getAllTourPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await TourPackageService.getAllTourPackages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour packages retrieved successfully',
    data: result,
  });
});

export const TourPackageController = {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getTourPackageById,
  getAllTourPackages,
};
