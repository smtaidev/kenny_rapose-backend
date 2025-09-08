import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICreateUserAssistance } from '../../interface/userAssistance.interface';

//=====================Create User Assistance Request=====================
const createUserAssistance = async (data: ICreateUserAssistance) => {
  const userAssistance = await prisma.userAssistance.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      concern: data.concern,
      status: 'PENDING',
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
      concern: true,
      status: true,
      response: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userAssistance;
};

//=====================Get All User Assistance Requests (Admin Only)=====================
const getAllUserAssistance = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [userAssistanceRequests, totalCount] = await Promise.all([
    prisma.userAssistance.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        concern: true,
        status: true,
        response: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.userAssistance.count()
  ]);

  return {
    userAssistanceRequests,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
    },
  };
};

//=====================Get User Assistance Request by ID (Admin Only)=====================
const getUserAssistanceById = async (id: string) => {
  const userAssistance = await prisma.userAssistance.findUnique({
    where: { 
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
      concern: true,
      status: true,
      response: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!userAssistance) {
    throw new AppError(httpStatus.NOT_FOUND, 'User assistance request not found');
  }

  return userAssistance;
};


//=====================Delete User Assistance Request (Admin Only)=====================
const deleteUserAssistance = async (id: string) => {
  const userAssistance = await prisma.userAssistance.findUnique({
    where: { 
      id,
    },
  });

  if (!userAssistance) {
    throw new AppError(httpStatus.NOT_FOUND, 'User assistance request not found');
  }

  await prisma.userAssistance.delete({
    where: { id },
  });

  return { message: 'User assistance request deleted successfully' };
};


export const UserAssistanceService = {
  createUserAssistance,
  getAllUserAssistance,
  getUserAssistanceById,
  deleteUserAssistance,
};
