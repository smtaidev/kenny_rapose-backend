import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { IUserResponse, IUpdateUser } from '../../interface/user.interface';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import AppError from '../../errors/AppError';
import { userProfileDataSchema } from './user.validation';

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
  
  // Parse JSON data from form data
  const userProfileData = JSON.parse(req.body.data);
  
  // Validate the parsed JSON data
  const validatedData = userProfileDataSchema.parse(userProfileData);
  
  // Convert to proper format for service
  const serviceData = {
    ...validatedData,
    dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
  };
  
  // Check if request has files (multipart/form-data)
  const files = req.files as {
    profilePhoto?: Express.Multer.File[];
    coverPhoto?: Express.Multer.File[];
  };

  let result;
  
  if (files && (files.profilePhoto || files.coverPhoto)) {
    // Handle with photos
    result = await UserService.updateUserProfileWithPhotos(email, serviceData, files);
    
    sendResponse<IUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User profile updated successfully with photos',
      data: result,
    });
  } else {
    // Handle without photos
    result = await UserService.updateUserProfile(email, serviceData);

    sendResponse<IUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User profile updated successfully',
      data: result,
    });
  }
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
  const { page = 1, limit = 20 } = req.query;
  
  const result = await UserService.getAllUsers(
    Number(page), 
    Number(limit)
  );

  sendResponse(res, {
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
