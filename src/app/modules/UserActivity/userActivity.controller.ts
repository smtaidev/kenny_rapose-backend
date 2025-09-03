import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserActivityService } from './userActivity.service';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import { requireAdmin } from '../../middlewares/auth';

//=====================Get User Activities=====================
const getUserActivities = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user?.userId; // From auth middleware
  
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
const markAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
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
const markAllAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  
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
const getUnreadCount = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  
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
const deleteUserActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
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

//=====================Admin: Get All User Activities (Including Deleted)=====================
const getAllUserActivitiesForAdmin = catchAsync(async (req: AuthRequest, res: Response) => {
  const { userId, page = 1, limit = 20 } = req.query;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User ID is required',
    });
  }

  const result = await UserActivityService.getAllUserActivitiesForAdmin(
    userId as string, 
    Number(page), 
    Number(limit)
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All user activities retrieved successfully (including deleted)',
    data: result,
  });
});

//=====================Admin: Get All Unread Count (Including Deleted)=====================
const getAllUnreadCountForAdmin = catchAsync(async (req: AuthRequest, res: Response) => {
  const { userId } = req.query;
  
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User ID is required',
    });
  }

  const result = await UserActivityService.getAllUnreadCountForAdmin(userId as string);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All unread count retrieved successfully (including deleted)',
    data: result,
  });
});

export const UserActivityController = {
  getUserActivities,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteUserActivity,
  // Admin functions
  getAllUserActivitiesForAdmin,
  getAllUnreadCountForAdmin,
};
