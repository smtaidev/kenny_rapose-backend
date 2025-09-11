import { z } from 'zod';

export const addToCartZodSchema = z.object({
  params: z.object({
    tourPackageId: z.string().min(1, 'Tour package ID is required'),
  }),
});

export const removeFromCartZodSchema = z.object({
  params: z.object({
    cartItemId: z.string().min(1, 'Cart item ID is required'),
  }),
});
