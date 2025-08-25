import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma';
import { generateToken } from '../../utils/generateToken';
import config from '../../../config';
import { ICreateUser, ILoginUser } from '../../interface/user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { generateUniqueTravelerNumber } from '../../utils/generateTravelerNumber';


//==================Create User or SignUp user===============
const createUser = async (userData: ICreateUser) => {
  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Email already registered');
    } else {
      // Handle soft-deleted users - delete and allow re-registration
      const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds),
      );

      // Use transaction for reactivating user
      const result = await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isActive: true,
            gender: userData.gender || existingUser.gender,
            dateOfBirth: userData.dateOfBirth || existingUser.dateOfBirth,
            phone: userData.phone || existingUser.phone,
            address: userData.address || existingUser.address,
            city: userData.city || existingUser.city,
            state: userData.state || existingUser.state,
            zip: userData.zip || existingUser.zip,
            country: userData.country || existingUser.country,
            //Reset tokens and OTP for security
            refreshToken: null,
            otp: null,
            otpExpiresAt: null,
            updatedAt: new Date(),
          },
          select: {
            id: true,
            travelerNumber: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            gender: true,
            dateOfBirth: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        //Generate tokens for the reactivated user
        const accessToken = generateToken.generateAccessToken({
          userId: updatedUser.id,
          email: updatedUser.email,
        });
        const refreshToken = generateToken.generateRefreshToken({
          userId: updatedUser.id,
          email: updatedUser.email,
        });

        //store refresh token in database within the same transaction
        await tx.user.update({
          where: { id: updatedUser.id },
          data: { refreshToken },
        });

        return {
          user: updatedUser,
          accessToken,
          refreshToken,
        };
      });

      return result;
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Generate unique traveler number
  const travelerNumber = await generateUniqueTravelerNumber(prisma);

  // Prepare data for user creation
  const userCreateData = {
    ...userData,
    password: hashedPassword,
    travelerNumber,
  };

  // Use transaction for new user creation
  const result = await prisma.$transaction(async (tx) => {
    // Create new user
    const user = await tx.user.create({
      data: userCreateData,
      select: {
        id: true,
        travelerNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        gender: true,
        dateOfBirth: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const accessToken = generateToken.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateToken.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token in database within the same transaction
    await tx.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Return user data with tokens
    return {
      user,
      accessToken,
      refreshToken,
    };
  });

  return result;
};

//=====================Loging User======================
const loginUser = async (loginData: ILoginUser) => {
  const { email, password } = loginData;

  // Find user and check if active
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Use transaction for login operations
  const result = await prisma.$transaction(async (tx) => {
    // Generate tokens
    const accessToken = generateToken.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateToken.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token in database within the same transaction
    await tx.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Return only essential user data
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  });

  return result;
};

//=======================Refresh Token=====================
const refreshToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      config.jwt.refresh_secret as string,
    ) as {
      userId: string;
      email: string;
    };

    // Find user and check if active
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
        isActive: true,
      },
    });

    if (!user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Invalid refresh token or account deactivated',
      );
    }

    // Use transaction for token refresh operations
    const result = await prisma.$transaction(async (tx) => {
      // Generate new tokens
      const newAccessToken = generateToken.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      const newRefreshToken = generateToken.generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      // Store new refresh token in database within the same transaction
      await tx.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    });

    return result;
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};

//=========================LogOut User=====================
const logoutUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Clear refresh token for security
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: 'Logged out successfully' };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
};
