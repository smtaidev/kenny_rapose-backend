import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICreateUserActivity } from '../../interface/user.interface';

//=====================Create User Activity=====================
const createUserActivity = async (activityData: ICreateUserActivity) => {
  const newActivity = await prisma.userActivity.create({
    data: activityData,
    select: {
      id: true,
      userId: true,
      type: true,
      title: true,
      message: true,
      metadata: true,
      isRead: true,
      isDeleted: true,
      createdAt: true,
    },
  });

  return newActivity;
};

//=====================Get User Activities with Pagination=====================
const getUserActivities = async (userId: string, page = 1, limit = 20, includeDeleted = false) => {
  const skip = (page - 1) * limit;
  
  // For regular users, exclude soft-deleted activities
  // For admins, include all activities if includeDeleted is true
  const whereClause = includeDeleted 
    ? { userId } 
    : { 
        userId,
        isDeleted: false
      };
  
  const [activities, totalCount] = await Promise.all([
    prisma.userActivity.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        metadata: true,
        isRead: true,
        isDeleted: true,
        createdAt: true,
      },
    }),
    prisma.userActivity.count({
      where: whereClause,
    }),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

//=====================Mark Activity as Read=====================
const markAsRead = async (activityId: string, userId: string) => {
  const activity = await prisma.userActivity.findFirst({
    where: { 
      id: activityId, 
      userId,
      isDeleted: false
    },
  });

  if (!activity) {
    throw new AppError(httpStatus.NOT_FOUND, 'Activity not found');
  }

  const updatedActivity = await prisma.userActivity.update({
    where: { id: activityId },
    data: { isRead: true },
    select: {
      id: true,
      isRead: true,
      isDeleted: true,
      createdAt: true,
    },
  });

  return updatedActivity;
};

//=====================Mark All Activities as Read=====================
const markAllAsRead = async (userId: string) => {
  const result = await prisma.userActivity.updateMany({
    where: { 
      userId, 
      isRead: false,
      isDeleted: false
    },
    data: { isRead: true },
  });

  return { message: `${result.count} activities marked as read` };
};

//=====================Get Unread Count=====================
const getUnreadCount = async (userId: string) => {
  const count = await prisma.userActivity.count({
    where: { 
      userId, 
      isRead: false,
      isDeleted: false
    },
  });

  return { unreadCount: count };
};

//=====================Delete User Activity (Soft Delete)=====================
const deleteUserActivity = async (activityId: string, userId: string) => {
  const activity = await prisma.userActivity.findFirst({
    where: { 
      id: activityId, 
      userId,
      isDeleted: false
    },
  });

  if (!activity) {
    throw new AppError(httpStatus.NOT_FOUND, 'Activity not found');
  }

  // Soft delete by updating isDeleted field
  const updatedActivity = await prisma.userActivity.update({
    where: { id: activityId },
    data: { 
      isDeleted: true
    },
    select: {
      id: true,
      title: true,
      isDeleted: true,
      createdAt: true,
    },
  });

  return { 
    message: 'Activity deleted successfully',
    activity: updatedActivity
  };
};

//=====================Admin: Get All User Activities (Including Deleted)=====================
const getAllUserActivitiesForAdmin = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [activities, totalCount] = await Promise.all([
    prisma.userActivity.findMany({
      where: { userId }, // No filtering - include all activities
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        metadata: true,
        isRead: true,
        isDeleted: true,
        createdAt: true,
      },
    }),
    prisma.userActivity.count({
      where: { userId },
    }),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

//=====================Admin: Get All Activities Count (Including Deleted)=====================
const getAllUnreadCountForAdmin = async (userId: string) => {
  const count = await prisma.userActivity.count({
    where: { userId, isRead: false }, // No soft delete filtering for admin
  });

  return { unreadCount: count };
};

export const UserActivityService = {
  createUserActivity,
  getUserActivities,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteUserActivity,
  // Admin functions
  getAllUserActivitiesForAdmin,
  getAllUnreadCountForAdmin,
};
