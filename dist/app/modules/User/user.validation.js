"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleZodSchema = exports.resetPasswordZodSchema = exports.changePasswordZodSchema = exports.verifyOtpZodSchema = exports.requestOtpZodSchema = exports.updateUserProfileZodSchema = void 0;
const zod_1 = require("zod");
// User profile update validation
exports.updateUserProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1, "First name cannot be empty").optional(),
        lastName: zod_1.z.string().min(1, "Last name cannot be empty").optional(),
        gender: zod_1.z.enum(["MALE", "FEMALE", "NON_BINARY"]).optional(),
        dateOfBirth: zod_1.z
            .date({ message: "Invalid date format" })
            .optional()
            .or(zod_1.z.date().optional()),
        phone: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 characters")
            .max(15, "Phone number cannot exceed 15 characters")
            .optional(),
        address: zod_1.z.string().min(1, "Address cannot be empty").optional(),
        city: zod_1.z.string().min(1, "City cannot be empty").optional(),
        state: zod_1.z.string().min(1, "State cannot be empty").optional(),
        zip: zod_1.z
            .string()
            .min(1, "Zip code cannot be empty")
            .max(20, "Zip code cannot exceed 20 characters")
            .optional(),
        profilePhoto: zod_1.z.string().url("Invalid profile photo URL").optional(),
        coverPhoto: zod_1.z.string().url("Invalid cover photo URL").optional(),
    }),
});
// OTP validation schemas
exports.requestOtpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email format").min(1, "Email cannot be empty"),
    }),
});
exports.verifyOtpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email format").min(1, "Email cannot be empty"),
        otp: zod_1.z
            .string()
            .length(6, "OTP must be exactly 6 digits")
            .regex(/^\d{6}$/, "OTP must contain only numbers"),
    }),
});
exports.changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        newPassword: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    }),
});
exports.resetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email format").min(1, "Email cannot be empty"),
        newPassword: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    }),
});
// User role update validation
exports.updateUserRoleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z
            .enum(["USER", "ADMIN", "SUPER_ADMIN"]),
    }),
});
