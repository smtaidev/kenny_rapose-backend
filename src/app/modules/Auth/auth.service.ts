import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { generateToken } from "../../utils/generateToken";
import config from "../../../config";
import { ICreateUser, ILoginUser } from "../../interface/user.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { generateUniqueTravelerNumber } from "../../utils/generateTravelerNumber";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

//==================Create User or SignUp user===============
const createUser = async (userData: ICreateUser) => {
  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Email already registered");
    } else {
      // Handle soft-deleted users - delete and allow re-registration
      const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds)
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
    Number(config.bcrypt_salt_rounds)
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

//=====================Login User======================
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
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // Check password
  if (!user.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
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
      config.jwt.refresh_secret as string
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
        "Invalid refresh token or account deactivated"
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
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
};

//=========================LogOut User=====================
const logoutUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Clear refresh token for security
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: "Logged out successfully" };
};

//=======================Firebase Google Sign In=====================
const googleSignIn = async (firebaseToken: string) => {
  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    const { email, name, picture, uid: firebaseUid } = decodedToken;

    if (!email) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Email not provided by Firebase"
      );
    }

    // Extract first and last name from the name field
    const nameParts = name ? name.split(" ") : ["User", "User"];
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "User";

    // Use transaction for Firebase sign-in operations
    const result = await prisma.$transaction(async (tx) => {
      // Check if user already exists
      let user = await tx.user.findUnique({
        where: { email },
      });

      if (user) {
        // User exists - update Firebase UID and provider if not set
        if (!user.googleId) {
          user = await tx.user.update({
            where: { id: user.id },
            data: {
              googleId: firebaseUid, // Store Firebase UID in googleId field
              provider: "firebase",
              isEmailVerified: true, // Firebase emails are verified
              profilePhoto: picture || user.profilePhoto,
            },
          });
        } else {
          // User already has Firebase UID - just update profile photo if needed
          if (picture && picture !== user.profilePhoto) {
            user = await tx.user.update({
              where: { id: user.id },
              data: { profilePhoto: picture },
            });
          }
        }
      } else {
        // Create new user with Firebase data
        const travelerNumber = await generateUniqueTravelerNumber(tx);

        user = await tx.user.create({
          data: {
            email,
            firstName,
            lastName,
            googleId: firebaseUid, // Store Firebase UID in googleId field
            provider: "firebase",
            isEmailVerified: true,
            profilePhoto: picture,
            travelerNumber,
            // Set default values for required fields
            isActive: true,
            aiCredits: 6,
          },
        });
      }

      // Generate tokens
      const accessToken = generateToken.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      const refreshToken = generateToken.generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      // Store refresh token in database
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
        profilePhoto: user.profilePhoto,
      };

      return {
        user: userResponse,
        accessToken,
        refreshToken,
      };
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Firebase authentication failed"
    );
  }
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  googleSignIn,
};
