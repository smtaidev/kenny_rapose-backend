import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth, { requireSuperAdmin } from '../../middlewares/auth';
import {
  updateUserProfileZodSchema,
  requestOtpZodSchema,
  verifyOtpZodSchema,
  changePasswordZodSchema,
  resetPasswordZodSchema,
  updateUserRoleZodSchema,
} from './user.validation';
import { requireAdmin } from '../../middlewares/auth';

const router = Router();

//==============Get User Profile=================
router.get('/profile', auth, UserController.getUserProfile);

//==============Get All Users (Admin Only)=================
router.get('/all', auth, requireAdmin, UserController.getAllUsers);

//==============Get User By ID (Admin Only)=================
router.get('/:id', auth, requireAdmin, UserController.getUserById);

//==============Update User Role (Admin Only)=================
router.patch('/:id/role', auth, requireSuperAdmin, validateRequest(updateUserRoleZodSchema), UserController.updateUserRole);

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
