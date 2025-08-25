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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const generateToken_1 = require("../../utils/generateToken");
const config_1 = __importDefault(require("../../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTravelerNumber_1 = require("../../utils/generateTravelerNumber");
//==================Create User or SignUp user===============
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = userData;
    // Check if user already exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        if (existingUser.isActive) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email already registered');
        }
        else {
            // Handle soft-deleted users - delete and allow re-registration
            const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
            // Use transaction for reactivating user
            const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                const updatedUser = yield tx.user.update({
                    where: { email },
                    data: {
                        password: hashedPassword,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        isActive: true,
                        gender: userData.gender || existingUser.gender,
                        dateOfBirth: userData.dateOfBirth || existingUser.dateOfBirth,
                        phone: userData.phone || existingUser.phone,
                        address: userData.address || existingUser.address,
                        city: userData.city || existingUser.city,
                        state: userData.state || existingUser.state,
                        zip: userData.zip || existingUser.zip,
                        country: userData.country || existingUser.country,
                        //Reset tokens and OTP for security
                        refreshToken: null,
                        otp: null,
                        otpExpiresAt: null,
                        updatedAt: new Date(),
                    },
                    select: {
                        id: true,
                        travelerNumber: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        isActive: true,
                        gender: true,
                        dateOfBirth: true,
                        phone: true,
                        address: true,
                        city: true,
                        state: true,
                        zip: true,
                        country: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });
                //Generate tokens for the reactivated user
                const accessToken = generateToken_1.generateToken.generateAccessToken({
                    userId: updatedUser.id,
                    email: updatedUser.email,
                });
                const refreshToken = generateToken_1.generateToken.generateRefreshToken({
                    userId: updatedUser.id,
                    email: updatedUser.email,
                });
                //store refresh token in database within the same transaction
                yield tx.user.update({
                    where: { id: updatedUser.id },
                    data: { refreshToken },
                });
                return {
                    user: updatedUser,
                    accessToken,
                    refreshToken,
                };
            }));
            return result;
        }
    }
    // Hash password
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    // Generate unique traveler number
    const travelerNumber = yield (0, generateTravelerNumber_1.generateUniqueTravelerNumber)(prisma_1.default);
    // Prepare data for user creation
    const userCreateData = Object.assign(Object.assign({}, userData), { password: hashedPassword, travelerNumber });
    // Use transaction for new user creation
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create new user
        const user = yield tx.user.create({
            data: userCreateData,
            select: {
                id: true,
                travelerNumber: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                gender: true,
                dateOfBirth: true,
                phone: true,
                address: true,
                city: true,
                state: true,
                zip: true,
                country: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        // Generate tokens
        const accessToken = generateToken_1.generateToken.generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = generateToken_1.generateToken.generateRefreshToken({
            userId: user.id,
            email: user.email,
        });
        // Store refresh token in database within the same transaction
        yield tx.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        // Return user data with tokens
        return {
            user,
            accessToken,
            refreshToken,
        };
    }));
    return result;
});
//=====================Loging User======================
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    // Find user and check if active
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    // Check password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    // Use transaction for login operations
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Generate tokens
        const accessToken = generateToken_1.generateToken.generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = generateToken_1.generateToken.generateRefreshToken({
            userId: user.id,
            email: user.email,
        });
        // Store refresh token in database within the same transaction
        yield tx.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        // Return only essential user data
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
        return {
            user: userResponse,
            accessToken,
            refreshToken,
        };
    }));
    return result;
});
//=======================Refresh Token=====================
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt.refresh_secret);
        // Find user and check if active
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: decoded.userId,
                isActive: true,
            },
        });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token or account deactivated');
        }
        // Use transaction for token refresh operations
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Generate new tokens
            const newAccessToken = generateToken_1.generateToken.generateAccessToken({
                userId: user.id,
                email: user.email,
            });
            const newRefreshToken = generateToken_1.generateToken.generateRefreshToken({
                userId: user.id,
                email: user.email,
            });
            // Store new refresh token in database within the same transaction
            yield tx.user.update({
                where: { id: user.id },
                data: { refreshToken: newRefreshToken },
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }));
        return result;
    }
    catch (_a) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token');
    }
});
//=========================LogOut User=====================
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Clear refresh token for security
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
});
exports.AuthService = {
    createUser,
    loginUser,
    refreshToken,
    logoutUser,
};
