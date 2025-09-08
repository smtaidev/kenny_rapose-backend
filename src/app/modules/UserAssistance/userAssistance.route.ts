import { Router } from 'express';
import { UserAssistanceController } from './userAssistance.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth, { requireAdmin } from '../../middlewares/auth';
import {
  createUserAssistanceZodSchema,
} from '../../interface/userAssistance.interface';

const router = Router();

//=====================Public Routes=====================

//=====================Create User Assistance Request=====================
router.post(
  '/',
  validateRequest(createUserAssistanceZodSchema),
  UserAssistanceController.createUserAssistance
);

//=====================Admin Routes=====================

//=====================Get All User Assistance Requests=====================
router.get(
  '/admin/all',
  auth,
  requireAdmin,
  UserAssistanceController.getAllUserAssistance
);

//=====================Get User Assistance Request by ID=====================
router.get(
  '/admin/:id',
  auth,
  requireAdmin,
  UserAssistanceController.getUserAssistanceById
);


//=====================Delete User Assistance Request=====================
router.delete(
  '/admin/:id',
  auth,
  requireAdmin,
  UserAssistanceController.deleteUserAssistance
);


export const UserAssistanceRoutes = router;
