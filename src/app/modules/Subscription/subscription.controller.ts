import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionService } from './subscription.service';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import AppError from '../../errors/AppError';

//=====================Subscribe Email=====================
const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.subscribe(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Email subscribed successfully',
    data: result,
  });
});

//=====================Get All Subscriptions (Admin Only)=====================
const getAllSubscriptions = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await SubscriptionService.getAllSubscriptions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All subscriptions retrieved successfully',
    data: result,
  });
});

export const SubscriptionController = {
  subscribe,
  getAllSubscriptions,
};
