import { z } from 'zod';

export const createAiCreditPackageZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Package name is required'),
    credits: z.number().int('Credits must be a whole number').positive('Credits must be positive'),
    price: z.number().positive('Price must be positive'),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  }),
});

export const updateAiCreditPackageZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Package name cannot be empty').optional(),
    credits: z.number().int('Credits must be a whole number').positive('Credits must be positive').optional(),
    price: z.number().positive('Price must be positive').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Package ID is required'),
  }),
});
