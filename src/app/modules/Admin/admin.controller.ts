import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';

//=====================Get Dashboard Statistics=====================
const getDashboardStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await AdminService.getDashboardStats();
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

//=====================Get Users by Country Statistics=====================
const getUsersByCountry = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await AdminService.getUsersByCountry();
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users by country statistics retrieved successfully',
    data: result,
  });
});

//=====================Get Tour Bookings per Month=====================
const getTourBookingsPerMonth = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await AdminService.getTourBookingsPerMonth();
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour bookings per month retrieved successfully',
    data: result,
  });
});

//=====================Get All Booked Tour Packages=====================
const getAllBookedTourPackages = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  
  const result = await AdminService.getAllBookedTourPackages(
    Number(page), 
    Number(limit)
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All booked tour packages retrieved successfully',
    data: result,
  });
});

//=====================Get Tour Package Analytics=====================
const getTourPackageAnalytics = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  
  const result = await AdminService.getTourPackageAnalytics(
    Number(page), 
    Number(limit)
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour package analytics retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  getDashboardStats,
  getUsersByCountry,
  getTourBookingsPerMonth,
  getAllBookedTourPackages,
  getTourPackageAnalytics,
};
