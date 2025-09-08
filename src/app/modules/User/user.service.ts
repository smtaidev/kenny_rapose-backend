import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IUpdateUser } from '../../interface/user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { sendOtpEmail } from '../../utils/sendEmail';

//=====================Get User Profile=====================
const getUserProfile = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
    select: {
      id: true,
      travelerNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      aiCredits: true,
      gender: true,
      dateOfBirth: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

//=====================Update User Profile=====================
const updateUserProfile = async (email: string, updateData: IUpdateUser) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: updateData,
    select: {
      id: true,
      travelerNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      aiCredits: true,
      gender: true,
      dateOfBirth: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};


//=====================Change Password=====================
const changePassword = async (email: string, oldPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
    select: { password: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Use transaction for password change operations
  const result = await prisma.$transaction(async (tx) => {
    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Old password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    // Update password
    await tx.user.update({
      where: { email },
      data: { 
        password: hashedNewPassword,
      },
    });

    return { message: 'Password changed successfully' };
  });

  return result;
};

//=====================Request Reset Password OTP=====================
const requestResetPasswordOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP with expiration
  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiresAt,
    },
  });

  // Send email with OTP
  try {
    await sendOtpEmail(email, otp);
    return { message: 'OTP sent to your email' };
  } catch (error) {
    // If email fails, still return success but log the error
    console.error('Failed to send OTP email:', error);
    return { message: 'OTP generated but email delivery failed. Please try again.' };
  }
};

//=====================Verify Reset Password OTP=====================
const verifyResetPasswordOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      otp,
      otpExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // Clear OTP after verification
  await prisma.user.update({
    where: { email },
    data: {
      otp: null,
      otpExpiresAt: null,
    },
  });

  return { message: 'OTP verified successfully' };
};

//=====================Reset Password=====================
const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Use transaction for password reset operations
  const result = await prisma.$transaction(async (tx) => {
    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    // Update password and clear any existing OTP within the same transaction
    await tx.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return { message: 'Password reset successfully' };
  });

  return result;
};

//=====================Resend OTP=====================
const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store new OTP with expiration
  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiresAt,
    },
  });

  // Send email with new OTP
  try {
    await sendOtpEmail(email, otp);
    return { message: 'OTP resent to your email' };
  } catch (error) {
    // If email fails, still return success but log the error
    console.error('Failed to send OTP email:', error);
    return { message: 'OTP generated but email delivery failed. Please try again.' };
  }
};

//=====================Soft Delete User=====================
const softDeleteUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Soft delete
  await prisma.user.update({
    where: { email },
    data: { 
      isActive: false,
      deletedAt: new Date(),
    },
  });

  return { message: 'User soft deleted successfully' };
};

//=====================Get All Users (Admin Only)=====================
const getAllUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      // Remove isActive filter to show all users including inactive ones
      select: {
        id: true,
        travelerNumber: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        deletedAt: true,
        aiCredits: true,
        breezeWalletBalance: true,
        gender: true,
        dateOfBirth: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }, // Newest first
    }),
    prisma.user.count()
  ]);

  // Add computed status field
  const usersWithStatus = users.map(user => ({
    ...user,
    status: {
      isActive: user.isActive,
      isDeleted: user.deletedAt !== null,
      deletedAt: user.deletedAt,
    },
    wallet: {
      breezeWalletBalance: user.breezeWalletBalance,
      aiCredits: user.aiCredits,
    },
  }));

  return {
    users: usersWithStatus,
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

//=====================Get User By ID (Admin Only)=====================
const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isActive: true },
    select: {
      id: true,
      travelerNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      aiCredits: true,
      gender: true,
      dateOfBirth: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

//=====================Update User Role (Admin Only)=====================
const updateUserRole = async (userId: string, newRole: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isActive: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Validate role
  if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(newRole)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid role');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
    select: {
      id: true,
      travelerNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      aiCredits: true,
      gender: true,
      dateOfBirth: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const UserService = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  requestResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
  resendOtp,
  softDeleteUser,
  getAllUsers,
  getUserById,
  updateUserRole,
};
