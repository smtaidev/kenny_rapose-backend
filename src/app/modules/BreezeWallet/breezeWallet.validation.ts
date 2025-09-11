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

export const convertCreditsToWalletZodSchema = z.object({
  body: z.object({
    creditsToConvert: z
      .number()
      .int('Credits must be a whole number')
      .min(20, 'Minimum 20 credits required for conversion')
      .refine(
        (val) => val % 20 === 0,
        'Credits must be in multiples of 20 (20 credits = $1)'
      ),
  }),
});