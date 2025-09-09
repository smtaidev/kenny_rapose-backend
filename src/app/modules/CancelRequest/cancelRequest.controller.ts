import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CancelRequestService } from './cancelRequest.service';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';

//=====================Create Cancel Request=====================
const createCancelRequest = catchAsync(async (req: AuthRequest, res: Response) => {
  const { tourBookingId } = req.body;
  const userId = req.user?.userId;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await CancelRequestService.createCancelRequest(userId, { tourBookingId });
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Cancel request created successfully',
    data: result,
  });
});

//=====================Get All Cancel Requests (Admin)=====================
const getAllCancelRequests = catchAsync(async (req: AuthRequest, res: Response) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const result = await CancelRequestService.getAllCancelRequests({
    status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined,
    page: Number(page),
    limit: Number(limit),
  });
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cancel requests retrieved successfully',
    data: result,
  });
});

//=====================Update Cancel Request Status (Admin)=====================
const updateCancelRequestStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const result = await CancelRequestService.updateCancelRequestStatus(id, { status });
  
  const statusMessage = status === 'APPROVED' 
    ? 'Cancel request approved successfully. Please process refund manually.'
    : status === 'REJECTED'
    ? 'Cancel request rejected successfully.'
    : 'Cancel request status updated successfully';

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: statusMessage,
    data: result,
  });
});

export const CancelRequestController = {
  createCancelRequest,
  getAllCancelRequests,
  updateCancelRequestStatus,
};
