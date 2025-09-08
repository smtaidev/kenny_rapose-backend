import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserAssistanceService } from './userAssistance.service';
import { IUserAssistanceResponse } from '../../interface/userAssistance.interface';
import httpStatus from 'http-status';

//=====================Create User Assistance Request=====================
const createUserAssistance = catchAsync(async (req: Request, res: Response) => {
  const result = await UserAssistanceService.createUserAssistance(req.body);

  sendResponse<IUserAssistanceResponse>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User assistance request submitted successfully',
    data: result,
  });
});

//=====================Get All User Assistance Requests (Admin Only)=====================
const getAllUserAssistance = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  
  const result = await UserAssistanceService.getAllUserAssistance(
    Number(page), 
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User assistance requests retrieved successfully',
    data: result,
  });
});

//=====================Get User Assistance Request by ID (Admin Only)=====================
const getUserAssistanceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserAssistanceService.getUserAssistanceById(id);

  sendResponse<IUserAssistanceResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User assistance request retrieved successfully',
    data: result,
  });
});


//=====================Delete User Assistance Request (Admin Only)=====================
const deleteUserAssistance = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserAssistanceService.deleteUserAssistance(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User assistance request deleted successfully',
    data: result,
  });
});


export const UserAssistanceController = {
  createUserAssistance,
  getAllUserAssistance,
  getUserAssistanceById,
  deleteUserAssistance,
};
