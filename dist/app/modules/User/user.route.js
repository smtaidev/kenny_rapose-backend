"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importStar(require("../../middlewares/auth"));
const user_validation_1 = require("./user.validation");
const auth_2 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
//==============Get User Profile=================
router.get('/profile', auth_1.default, user_controller_1.UserController.getUserProfile);
//==============Get All Users (Admin Only)=================
router.get('/all', auth_1.default, auth_2.requireAdmin, user_controller_1.UserController.getAllUsers);
//==============Get User By ID (Admin Only)=================
router.get('/:id', auth_1.default, auth_2.requireAdmin, user_controller_1.UserController.getUserById);
//==============Update User Role (Admin Only)=================
router.patch('/:id/role', auth_1.default, auth_1.requireSuperAdmin, (0, validateRequest_1.default)(user_validation_1.updateUserRoleZodSchema), user_controller_1.UserController.updateUserRole);
//==============Update Profile==============
router.patch('/profile', auth_1.default, (0, validateRequest_1.default)(user_validation_1.updateUserProfileZodSchema), user_controller_1.UserController.updateUserProfile);
//===============Verify User Profile===============
router.patch('/verify-profile', auth_1.default, user_controller_1.UserController.verifyUserProfile);
//===============Change Password==============
router.post('/change-password', auth_1.default, // Add authentication middleware
(0, validateRequest_1.default)(user_validation_1.changePasswordZodSchema), user_controller_1.UserController.changePassword);
//================Resend OTP================
router.post('/resend-otp', (0, validateRequest_1.default)(user_validation_1.requestOtpZodSchema), user_controller_1.UserController.resendOtp);
//================Reset Password===============
router.post('/request-reset-password-otp', (0, validateRequest_1.default)(user_validation_1.requestOtpZodSchema), user_controller_1.UserController.requestResetPasswordOtp);
router.post('/verify-reset-password-otp', (0, validateRequest_1.default)(user_validation_1.verifyOtpZodSchema), user_controller_1.UserController.verifyResetPasswordOtp);
router.post('/reset-password', (0, validateRequest_1.default)(user_validation_1.resetPasswordZodSchema), user_controller_1.UserController.resetPassword);
//============Soft Delete User==================
router.delete('/profile', auth_1.default, user_controller_1.UserController.softDeleteUser);
exports.UserRouters = router;
