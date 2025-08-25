import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import {
  updateUserProfileZodSchema,
  requestOtpZodSchema,
  verifyOtpZodSchema,
  changePasswordZodSchema,
  resetPasswordZodSchema,
} from './user.validation';

const router = Router();

//==============Get User Profile=================
router.get('/profile', auth, UserController.getUserProfile);

//==============Update Profile==============
router.patch(
  '/profile',
  auth,
  validateRequest(updateUserProfileZodSchema),
  UserController.updateUserProfile,
);

//===============Verify User Profile===============
router.patch('/verify-profile', auth, UserController.verifyUserProfile);

//===============Change Password==============
router.post(
  '/change-password',
  auth, // Add authentication middleware
  validateRequest(changePasswordZodSchema),
  UserController.changePassword,
);

//================Resend OTP================
router.post(
  '/resend-otp',
  validateRequest(requestOtpZodSchema),
  UserController.resendOtp,
);

//================Reset Password===============
router.post(
  '/request-reset-password-otp',
  validateRequest(requestOtpZodSchema),
  UserController.requestResetPasswordOtp,
);

router.post(
  '/verify-reset-password-otp',
  validateRequest(verifyOtpZodSchema),
  UserController.verifyResetPasswordOtp,
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordZodSchema),
  UserController.resetPassword,
);

//============Soft Delete User==================
router.delete('/profile', auth, UserController.softDeleteUser);

export const UserRouters: Router = router;
