import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { IUserResponse } from '../../interface/user.interface';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import AppError from '../../errors/AppError';

const getUserProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  // If email is provided in params, use it; otherwise use authenticated user's email
  const email = req.user?.email || req.query.email || req.body.email;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  const result = await UserService.getUserProfile(email);

  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

// =====================Update User Profile=====================
const updateUserProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email } = req.user as { email: string };
  const result = await UserService.updateUserProfile(email, req.body);

  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

//=====================Verify User Profile ===================
const verifyUserProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const { userId } = req.user as { userId: string };
  const result = await UserService.verifyUserProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Profile verified successfully',
    data: result,
  });
});

//=======================Change Password=======================

const changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const email = req.user?.email;
  
  if (!email) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  
  await UserService.changePassword(email, oldPassword, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: null,
  });
});

//==================Reset Password====================

const requestResetPasswordOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await UserService.requestResetPasswordOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP sent to your email',
    data: null,
  });
});

const verifyResetPasswordOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await UserService.verifyResetPasswordOtp(email, otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP verified, you can now reset your password',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  await UserService.resetPassword(email, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successfully',
    data: null,
  });
});

//==================Resend OTP====================
const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await UserService.resendOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP resent to your email',
    data: null,
  });
});

//===============Soft Delete User==============
const softDeleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const email = req.user?.email;
  if (!email) {
    res.status(400).json({ message: 'User email not found' });
    return;
  }
  const result = await UserService.softDeleteUser(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User soft deleted successfully',
    data: result,
  });
});

//=====================Get User By ID (Admin Only)=====================
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id);

  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

//=====================Get All Users (Admin Only)=====================
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse<IUserResponse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users retrieved successfully',
    data: result,
  });
});

//=====================Update User Role (Admin Only)=====================
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await UserService.updateUserRole(id, role);

  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

export const UserController = {
  getUserProfile,
  updateUserProfile,
  verifyUserProfile,
  changePassword,
  requestResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
  resendOtp,
  softDeleteUser,
  getUserById,
  getAllUsers,
  updateUserRole,
};
