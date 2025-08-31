import { z } from 'zod';

export const createBreezeWalletPackageZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Package name is required'),
    amount: z.number().positive('Amount must be positive'),
    price: z.number().positive('Price must be positive'),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  }),
});

export const updateBreezeWalletPackageZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Package name cannot be empty').optional(),
    amount: z.number().positive('Amount must be positive').optional(),
    price: z.number().positive('Price must be positive').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Package ID is required'),
  }),
});

export const getWalletBalanceZodSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});
