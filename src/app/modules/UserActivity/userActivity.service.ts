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
      createdAt: true,
    },
  });

  return newActivity;
};

//=====================Get User Activities with Pagination=====================
const getUserActivities = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [activities, totalCount] = await Promise.all([
    prisma.userActivity.findMany({
      where: { userId },
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

//=====================Mark Activity as Read=====================
const markAsRead = async (activityId: string, userId: string) => {
  const activity = await prisma.userActivity.findFirst({
    where: { id: activityId, userId },
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
      updatedAt: true,
    },
  });

  return updatedActivity;
};

//=====================Mark All Activities as Read=====================
const markAllAsRead = async (userId: string) => {
  const result = await prisma.userActivity.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { message: `${result.count} activities marked as read` };
};

//=====================Get Unread Count=====================
const getUnreadCount = async (userId: string) => {
  const count = await prisma.userActivity.count({
    where: { userId, isRead: false },
  });

  return { unreadCount: count };
};

//=====================Delete User Activity=====================
const deleteUserActivity = async (activityId: string, userId: string) => {
  const activity = await prisma.userActivity.findFirst({
    where: { id: activityId, userId },
  });

  if (!activity) {
    throw new AppError(httpStatus.NOT_FOUND, 'Activity not found');
  }

  await prisma.userActivity.delete({
    where: { id: activityId },
  });

  return { message: 'Activity deleted successfully' };
};

export const UserActivityService = {
  createUserActivity,
  getUserActivities,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteUserActivity,
};
