import express from 'express';
import { UserActivityController } from './userActivity.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

//=====================Get User Activities (Authenticated User)=====================
router.get(
  '/',
  auth,
  UserActivityController.getUserActivities
);

//=====================Mark Activity as Read (Authenticated User)=====================
router.patch(
  '/:id/read',
  auth,
  UserActivityController.markAsRead
);

//=====================Mark All Activities as Read (Authenticated User)=====================
router.patch(
  '/mark-all-read',
  auth,
  UserActivityController.markAllAsRead
);

//=====================Get Unread Count (Authenticated User)=====================
router.get(
  '/unread-count',
  auth,
  UserActivityController.getUnreadCount
);

//=====================Delete User Activity (Authenticated User)=====================
router.delete(
  '/:id',
  auth,
  UserActivityController.deleteUserActivity
);

export const UserActivityRoutes = router;
