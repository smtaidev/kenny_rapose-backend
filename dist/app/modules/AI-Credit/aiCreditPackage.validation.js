"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAiCreditPackageZodSchema = exports.createAiCreditPackageZodSchema = void 0;
const zod_1 = require("zod");
exports.createAiCreditPackageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Package name is required'),
        credits: zod_1.z.number().int('Credits must be a whole number').positive('Credits must be positive'),
        price: zod_1.z.number().positive('Price must be positive'),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
    }),
});
exports.updateAiCreditPackageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Package name cannot be empty').optional(),
        credits: zod_1.z.number().int('Credits must be a whole number').positive('Credits must be positive').optional(),
        price: zod_1.z.number().positive('Price must be positive').optional(),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Package ID is required'),
    }),
});
