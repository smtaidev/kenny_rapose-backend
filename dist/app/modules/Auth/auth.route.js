"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouters = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.post('/signup', (0, validateRequest_1.default)(auth_validation_1.createUserZodSchema), auth_controller_1.AuthController.createUser);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.loginUserZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
// Protected routes (require authentication)
router.post('/logout', auth_1.default, auth_controller_1.AuthController.logoutUser);
exports.AuthRouters = router;
