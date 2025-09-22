import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import {
  createUserZodSchema,
  loginUserZodSchema,
  refreshTokenZodSchema,
  googleSignInZodSchema,
} from "./auth.validation";

const router = Router();

// Public routes (no authentication required)
router.post(
  "/signup",
  validateRequest(createUserZodSchema),
  AuthController.createUser
);
router.post(
  "/login",
  validateRequest(loginUserZodSchema),
  AuthController.loginUser
);
router.post(
  "/google-signin",
  validateRequest(googleSignInZodSchema),
  AuthController.googleSignIn
);
router.post(
  "/refresh-token",
  validateRequest(refreshTokenZodSchema),
  AuthController.refreshToken
);

// Protected routes (require authentication)
router.post("/logout", auth, AuthController.logoutUser);

export const AuthRouters: Router = router;
