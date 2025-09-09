import express from 'express';
import { CancelRequestController } from './cancelRequest.controller';
import auth, { requireAdmin } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { 
  createCancelRequestZodSchema, 
  updateCancelRequestStatusZodSchema,
  getCancelRequestsZodSchema 
} from './cancelRequest.validation';

const router = express.Router();

//=====================Create Cancel Request (Authenticated User)=====================
router.post(
  '/',
  auth,
  validateRequest(createCancelRequestZodSchema),
  CancelRequestController.createCancelRequest
);

//=====================Get All Cancel Requests (Admin Only)=====================
router.get(
  '/admin/all',
  auth,
  requireAdmin,
  validateRequest(getCancelRequestsZodSchema),
  CancelRequestController.getAllCancelRequests
);

//=====================Update Cancel Request Status (Admin Only)=====================
router.patch(
  '/admin/:id/status',
  auth,
  requireAdmin,
  validateRequest(updateCancelRequestStatusZodSchema),
  CancelRequestController.updateCancelRequestStatus
);

export const CancelRequestRoutes = router;
