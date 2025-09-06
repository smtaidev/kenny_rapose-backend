import express from 'express';
import { UserActivityController } from './userActivity.controller';
import auth, { requireAdmin } from '../../middlewares/auth';

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

//=====================Admin Routes=====================

//=====================Admin: Get All User Activities (Including Deleted)=====================
router.get(
  '/admin/all-activities',
  auth,
  requireAdmin,
  UserActivityController.getAllUserActivitiesForAdmin
);

//=====================Admin: Get All Unread Count (Including Deleted)=====================
router.get(
  '/admin/all-unread-count',
  auth,
  requireAdmin,
  UserActivityController.getAllUnreadCountForAdmin
);

//=====================Admin: Mark Activity as Read=====================
router.patch(
  '/:id/admin-read',
  auth,
  requireAdmin,
  UserActivityController.markAsReadByAdmin
);

//=====================Admin: Mark All Activities as Read=====================
router.patch(
  '/admin/mark-all-read',
  auth,
  requireAdmin,
  UserActivityController.markAllAsReadByAdmin
);

//=====================Admin: Get Specific User All Activities (Including Deleted)=====================
router.get(
  '/admin/user/:userId',
  auth,
  requireAdmin,
  UserActivityController.getSpecificUserAllActivitiesForAdmin
);

export const UserActivityRoutes = router;
