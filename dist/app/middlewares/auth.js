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
exports.requireSuperAdmin = exports.requireAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const prisma_2 = require("../../../generated/prisma");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get token from cookie (website standard)
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized - No token provided' });
        return;
    }
    try {
        // Validate JWT secret exists
        if (!config_1.default.jwt.access_secret) {
            throw new Error('JWT access secret not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.access_secret);
        // Check if user exists and is active
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: decoded.email,
                isActive: true
            },
            select: { id: true, email: true, isActive: true, role: true }
        });
        if (!user) {
            res.status(401).json({ message: 'User not found or account deactivated' });
            return;
        }
        req.user = {
            email: decoded.email,
            userId: decoded.userId,
            role: user.role
        };
        next();
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
});
// Add role-based authorization middleware
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'Access denied - Insufficient permissions' });
            return;
        }
        next();
    };
};
// Export middleware functions for different role requirements
exports.requireAdmin = requireRole([prisma_2.UserRole.ADMIN, prisma_2.UserRole.SUPER_ADMIN]);
exports.requireSuperAdmin = requireRole([prisma_2.UserRole.SUPER_ADMIN]);
exports.default = auth;
