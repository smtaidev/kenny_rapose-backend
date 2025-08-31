import { z } from 'zod';

const createCheckoutSessionSchema = z.object({
  body: z.object({
    packageId: z.string().uuid('Invalid package ID'),
    packageType: z.enum(['ai-credit', 'breeze-wallet']),
    successUrl: z.string().url('Invalid success URL'),
    cancelUrl: z.string().url('Invalid cancel URL'),
  }),
});

export const paymentValidation = {
  createCheckoutSessionSchema,
};
