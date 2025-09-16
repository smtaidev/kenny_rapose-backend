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
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const sendEmail_1 = require("../../utils/sendEmail");
const s3Upload_1 = require("../../utils/s3Upload");
//=====================Get User Profile=====================
const getUserProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
        select: {
            id: true,
            travelerNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            aiCredits: true,
            breezeWalletBalance: true,
            gender: true,
            dateOfBirth: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            isEmailVerified: true,
            profilePhoto: true,
            coverPhoto: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
//=====================Update User Profile=====================
const updateUserProfile = (email, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Store old photo URLs for cleanup after successful update
    const oldProfilePhoto = user.profilePhoto;
    const oldCoverPhoto = user.coverPhoto;
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: updateData,
        select: {
            id: true,
            travelerNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            aiCredits: true,
            gender: true,
            dateOfBirth: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            profilePhoto: true,
            coverPhoto: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // Delete old photos from S3 AFTER successful profile update
    if (updateData.profilePhoto && updateData.profilePhoto !== oldProfilePhoto && oldProfilePhoto) {
        try {
            yield (0, s3Upload_1.deleteFileFromS3)(oldProfilePhoto);
            console.log('Successfully deleted old profile photo:', oldProfilePhoto);
        }
        catch (error) {
            console.error('Failed to delete old profile photo:', error);
            // Don't throw error - profile update was successful
        }
    }
    if (updateData.coverPhoto && updateData.coverPhoto !== oldCoverPhoto && oldCoverPhoto) {
        try {
            yield (0, s3Upload_1.deleteFileFromS3)(oldCoverPhoto);
            console.log('Successfully deleted old cover photo:', oldCoverPhoto);
        }
        catch (error) {
            console.error('Failed to delete old cover photo:', error);
            // Don't throw error - profile update was successful
        }
    }
    return updatedUser;
});
//=====================Update User Profile with Photos=====================
const updateUserProfileWithPhotos = (email, updateData, files) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Store old photo URLs for cleanup
    const oldProfilePhoto = user.profilePhoto;
    const oldCoverPhoto = user.coverPhoto;
    // Prepare update data
    const finalUpdateData = Object.assign({}, updateData);
    // Handle profile photo upload
    if ((files === null || files === void 0 ? void 0 : files.profilePhoto) && files.profilePhoto.length > 0) {
        try {
            const profilePhotoUrl = yield (0, s3Upload_1.uploadFileToS3)(files.profilePhoto[0], 'profile-photo');
            finalUpdateData.profilePhoto = profilePhotoUrl;
        }
        catch (error) {
            console.error('Failed to upload profile photo:', error);
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to upload profile photo');
        }
    }
    // Handle cover photo upload
    if ((files === null || files === void 0 ? void 0 : files.coverPhoto) && files.coverPhoto.length > 0) {
        try {
            const coverPhotoUrl = yield (0, s3Upload_1.uploadFileToS3)(files.coverPhoto[0], 'cover-photo');
            finalUpdateData.coverPhoto = coverPhotoUrl;
        }
        catch (error) {
            console.error('Failed to upload cover photo:', error);
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to upload cover photo');
        }
    }
    // Update user profile
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: finalUpdateData,
        select: {
            id: true,
            travelerNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            aiCredits: true,
            gender: true,
            dateOfBirth: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            profilePhoto: true,
            coverPhoto: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // Clean up old photos AFTER successful update
    if (finalUpdateData.profilePhoto && finalUpdateData.profilePhoto !== oldProfilePhoto && oldProfilePhoto) {
        try {
            yield (0, s3Upload_1.deleteFileFromS3)(oldProfilePhoto);
            console.log('Successfully deleted old profile photo:', oldProfilePhoto);
        }
        catch (error) {
            console.error('Failed to delete old profile photo:', error);
        }
    }
    if (finalUpdateData.coverPhoto && finalUpdateData.coverPhoto !== oldCoverPhoto && oldCoverPhoto) {
        try {
            yield (0, s3Upload_1.deleteFileFromS3)(oldCoverPhoto);
            console.log('Successfully deleted old cover photo:', oldCoverPhoto);
        }
        catch (error) {
            console.error('Failed to delete old cover photo:', error);
        }
    }
    return updatedUser;
});
//=====================Change Password=====================
const changePassword = (email, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
        select: { password: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Use transaction for password change operations
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Verify old password
        const isOldPasswordValid = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Old password is incorrect');
        }
        // Hash new password
        const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        // Update password
        yield tx.user.update({
            where: { email },
            data: {
                password: hashedNewPassword,
            },
        });
        return { message: 'Password changed successfully' };
    }));
    return result;
});
//=====================Request Reset Password OTP=====================
const requestResetPasswordOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Store OTP with expiration
    yield prisma_1.default.user.update({
        where: { email },
        data: {
            otp,
            otpExpiresAt,
        },
    });
    // Send email with OTP
    try {
        yield (0, sendEmail_1.sendOtpEmail)(email, otp);
        return { message: 'OTP sent to your email' };
    }
    catch (error) {
        // If email fails, still return success but log the error
        console.error('Failed to send OTP email:', error);
        return { message: 'OTP generated but email delivery failed. Please try again.' };
    }
});
//=====================Verify Reset Password OTP=====================
const verifyResetPasswordOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email,
            otp,
            otpExpiresAt: { gt: new Date() },
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid or expired OTP');
    }
    // Clear OTP after verification
    yield prisma_1.default.user.update({
        where: { email },
        data: {
            otp: null,
            otpExpiresAt: null,
        },
    });
    return { message: 'OTP verified successfully' };
});
//=====================Reset Password=====================
const resetPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Use transaction for password reset operations
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Hash new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        // Update password and clear any existing OTP within the same transaction
        yield tx.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                otp: null,
                otpExpiresAt: null,
            },
        });
        return { message: 'Password reset successfully' };
    }));
    return result;
});
//=====================Resend OTP=====================
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Store new OTP with expiration
    yield prisma_1.default.user.update({
        where: { email },
        data: {
            otp,
            otpExpiresAt,
        },
    });
    // Send email with new OTP
    try {
        yield (0, sendEmail_1.sendOtpEmail)(email, otp);
        return { message: 'OTP resent to your email' };
    }
    catch (error) {
        // If email fails, still return success but log the error
        console.error('Failed to send OTP email:', error);
        return { message: 'OTP generated but email delivery failed. Please try again.' };
    }
});
//=====================Soft Delete User=====================
const softDeleteUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, isActive: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Soft delete
    yield prisma_1.default.user.update({
        where: { email },
        data: {
            isActive: false,
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
    return { message: 'User soft deleted successfully' };
});
//=====================Get All Users (Admin Only)=====================
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, totalCount] = yield Promise.all([
        prisma_1.default.user.findMany({
            skip,
            take: limit,
            // Remove isActive filter to show all users including inactive ones
            select: {
                id: true,
                travelerNumber: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                deletedAt: true,
                aiCredits: true,
                breezeWalletBalance: true,
                gender: true,
                dateOfBirth: true,
                phone: true,
                address: true,
                city: true,
                state: true,
                zip: true,
                country: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' }, // Newest first
        }),
        prisma_1.default.user.count()
    ]);
    // Add computed status field
    const usersWithStatus = users.map(user => (Object.assign(Object.assign({}, user), { status: {
            isActive: user.isActive,
            isDeleted: user.deletedAt !== null,
            deletedAt: user.deletedAt,
        }, wallet: {
            breezeWalletBalance: user.breezeWalletBalance,
            aiCredits: user.aiCredits,
        } })));
    return {
        users: usersWithStatus,
        pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNextPage: page < Math.ceil(totalCount / limit),
            hasPrevPage: page > 1,
        },
    };
});
//=====================Get User By ID (Admin Only)=====================
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId, isActive: true },
        select: {
            id: true,
            travelerNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            aiCredits: true,
            gender: true,
            dateOfBirth: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            isEmailVerified: true,
            profilePhoto: true,
            coverPhoto: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
//=====================Update User Role (Admin Only)=====================
const updateUserRole = (userId, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId, isActive: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Validate role
    if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(newRole)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid role');
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: {
            id: true,
            travelerNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            aiCredits: true,
            gender: true,
            dateOfBirth: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            isEmailVerified: true,
            profilePhoto: true,
            coverPhoto: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
exports.UserService = {
    getUserProfile,
    updateUserProfile,
    updateUserProfileWithPhotos,
    changePassword,
    requestResetPasswordOtp,
    verifyResetPasswordOtp,
    resetPassword,
    resendOtp,
    softDeleteUser,
    getAllUsers,
    getUserById,
    updateUserRole,
};
