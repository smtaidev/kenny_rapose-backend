import { UserRole, Gender } from '../../../generated/prisma';

export type IUser = {
  id: string;
  travelerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  aiCredits: number;
  gender?: Gender;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isEmailVerified: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type ICreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: Gender;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  role?: UserRole;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IUpdateUser = {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export type IUserResponse = {
  id: string;
  travelerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  aiCredits: number;
  gender: Gender | null;
  dateOfBirth: Date | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface IUserActivity {
  id: string;
  userId: string;
  type: 'AI_CREDIT_PURCHASE' | 'WALLET_TOPUP' | 'TOUR_BOOKING' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'LOGIN' | 'PROFILE_UPDATE';
  title: string;
  message: string;
  metadata?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface ICreateUserActivity {
  userId: string;
  type: 'AI_CREDIT_PURCHASE' | 'WALLET_TOPUP' | 'TOUR_BOOKING' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'LOGIN' | 'PROFILE_UPDATE';
  title: string;
  message: string;
  metadata?: any;
}
