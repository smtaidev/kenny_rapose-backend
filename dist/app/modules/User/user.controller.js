"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // If email is provided in params, use it; otherwise use authenticated user's email
    const email = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || req.query.email || req.body.email;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    const result = yield user_service_1.UserService.getUserProfile(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile retrieved successfully',
        data: result,
    });
}));
// =====================Update User Profile=====================
const updateUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    // Check if request has files (multipart/form-data)
    const files = req.files;
    let result;
    if (files && (files.profilePhoto || files.coverPhoto)) {
        // Handle with photos - extract form data
        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.country,
        };
        result = yield user_service_1.UserService.updateUserProfileWithPhotos(email, updateData, files);
    }
    else {
        // Handle without photos - use req.body directly
        result = yield user_service_1.UserService.updateUserProfile(email, req.body);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile updated successfully',
        data: result,
    });
}));
//=======================Change Password=======================
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { oldPassword, newPassword } = req.body;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    yield user_service_1.UserService.changePassword(email, oldPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Password changed successfully',
        data: null,
    });
}));
//==================Reset Password====================
const requestResetPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield user_service_1.UserService.requestResetPasswordOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP sent to your email',
        data: null,
    });
}));
const verifyResetPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    yield user_service_1.UserService.verifyResetPasswordOtp(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP verified, you can now reset your password',
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    yield user_service_1.UserService.resetPassword(email, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Password reset successfully',
        data: null,
    });
}));
//==================Resend OTP====================
const resendOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield user_service_1.UserService.resendOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP resent to your email',
        data: null,
    });
}));
//===============Soft Delete User==============
const softDeleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email) {
        res.status(400).json({ message: 'User email not found' });
        return;
    }
    const result = yield user_service_1.UserService.softDeleteUser(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User soft deleted successfully',
        data: result,
    });
}));
//=====================Get User By ID (Admin Only)=====================
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.getUserById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
}));
//=====================Get All Users (Admin Only)=====================
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = req.query;
    const result = yield user_service_1.UserService.getAllUsers(Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All users retrieved successfully',
        data: result,
    });
}));
//=====================Update User Role (Admin Only)=====================
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    const result = yield user_service_1.UserService.updateUserRole(id, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
}));
exports.UserController = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    requestResetPasswordOtp,
    verifyResetPasswordOtp,
    resetPassword,
    resendOtp,
    softDeleteUser,
    getUserById,
    getAllUsers,
    updateUserRole,
};
