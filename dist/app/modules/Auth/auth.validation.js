"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenZodSchema = exports.loginUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .email('Invalid email format'),
        password: zod_1.z
            .string()
            .min(6, 'Password must be at least 6 characters'),
        firstName: zod_1.z
            .string()
            .min(1, 'First name cannot be empty'),
        lastName: zod_1.z
            .string()
            .min(1, 'Last name cannot be empty'),
        gender: zod_1.z.enum(['MALE', 'FEMALE', 'NON_BINARY']).optional(),
        dateOfBirth: zod_1.z
            .string()
            .datetime('Invalid date format')
            .optional()
            .or(zod_1.z.date().optional()),
        phone: zod_1.z
            .string()
            .min(10, 'Phone number must be at least 10 characters')
            .max(15, 'Phone number cannot exceed 15 characters')
            .optional(),
        address: zod_1.z
            .string()
            .min(1, 'Address cannot be empty')
            .max(200, 'Address cannot exceed 200 characters')
            .optional(),
        city: zod_1.z
            .string()
            .min(1, 'City cannot be empty')
            .max(50, 'City cannot exceed 50 characters')
            .optional(),
        state: zod_1.z
            .string()
            .min(1, 'State cannot be empty')
            .max(50, 'State cannot exceed 50 characters')
            .optional(),
        zip: zod_1.z
            .string()
            .min(1, 'Zip code cannot be empty')
            .max(20, 'Zip code cannot exceed 20 characters')
            .optional(),
        country: zod_1.z
            .string()
            .min(1, 'Country cannot be empty')
            .max(50, 'Country cannot exceed 50 characters')
            .optional(),
    }),
});
exports.loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .email('Invalid email format'),
        password: zod_1.z
            .string(),
    }),
});
exports.refreshTokenZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z
            .string()
            .min(1, 'Refresh token cannot be empty'),
    }),
});
