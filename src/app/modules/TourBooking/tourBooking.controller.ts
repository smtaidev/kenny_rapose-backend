import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TourBookingService } from './tourBooking.service';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';

//=====================Create Tour Booking (Direct - No Payment)=====================
const createTourBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  // For direct booking without payment, create a dummy payment ID
  const dummyPaymentId = `dummy-${Date.now()}`;
  const result = await TourBookingService.createTourBooking(req.body, userId, dummyPaymentId);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Tour booking created successfully',
    data: result,
  });
});

//=====================Get User Tour Bookings=====================
const getUserTourBookings = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user?.userId;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await TourBookingService.getUserTourBookings(
    userId, 
    Number(page), 
    Number(limit)
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour bookings retrieved successfully',
    data: result,
  });
});

//=====================Get Tour Booking by ID=====================
const getTourBookingById = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await TourBookingService.getTourBookingById(id, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour booking retrieved successfully',
    data: result,
  });
});

//=====================Update Tour Booking=====================
const updateTourBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await TourBookingService.updateTourBooking(id, req.body, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour booking updated successfully',
    data: result,
  });
});

//=====================Cancel Tour Booking=====================
const cancelTourBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await TourBookingService.cancelTourBooking(id, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour booking cancelled successfully',
    data: result,
  });
});

//=====================Calculate Cashback=====================
const calculateCashback = catchAsync(async (req: AuthRequest, res: Response) => {
  const { tourPackageId, totalAmount } = req.query;
  
  if (!tourPackageId || !totalAmount) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Tour package ID and total amount are required',
    });
  }

  const result = await TourBookingService.calculateCashback(
    tourPackageId as string, 
    Number(totalAmount)
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cashback calculated successfully',
    data: result,
  });
});

export const TourBookingController = {
  createTourBooking,
  getUserTourBookings,
  getTourBookingById,
  updateTourBooking,
  cancelTourBooking,
  calculateCashback,
};
