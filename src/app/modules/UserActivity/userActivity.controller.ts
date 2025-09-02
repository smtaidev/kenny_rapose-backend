import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserActivityService } from './userActivity.service';
import httpStatus from 'http-status';

//=====================Get User Activities=====================
const getUserActivities = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user?.id; // From auth middleware
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await UserActivityService.getUserActivities(
    userId, 
    Number(page), 
    Number(limit)
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User activities retrieved successfully',
    data: result,
  });
});

//=====================Mark Activity as Read=====================
const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await UserActivityService.markAsRead(id, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity marked as read',
    data: result,
  });
});

//=====================Mark All Activities as Read=====================
const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await UserActivityService.markAllAsRead(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All activities marked as read',
    data: result,
  });
});

//=====================Get Unread Count=====================
const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await UserActivityService.getUnreadCount(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unread count retrieved successfully',
    data: result,
  });
});

//=====================Delete User Activity=====================
const deleteUserActivity = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await UserActivityService.deleteUserActivity(id, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity deleted successfully',
    data: result,
  });
});

export const UserActivityController = {
  getUserActivities,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteUserActivity,
};
