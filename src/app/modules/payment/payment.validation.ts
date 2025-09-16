import { z } from 'zod';

const createCheckoutSessionSchema = z.object({
  body: z.object({
    packageId: z.string().uuid('Invalid package ID'),
    packageType: z.enum(['ai-credit', 'breeze-wallet', 'tour']),
    successUrl: z.string().url('Invalid success URL'),
    cancelUrl: z.string().url('Invalid cancel URL'),
    // Tour booking specific fields
    amount: z.number().positive('Amount must be positive').optional(),
    adults: z.number().int().min(0, 'Adults count cannot be negative').optional(),
    children: z.number().int().min(0, 'Children count cannot be negative').optional(),
    infants: z.number().int().min(0, 'Infants count cannot be negative').optional(),
    travelDate: z.string().datetime('Invalid travel date').optional(),
  }).refine((data) => {
    // If packageType is 'tour', require amount and passenger details
    if (data.packageType === 'tour') {
      return data.amount !== undefined && 
             data.adults !== undefined && 
             data.children !== undefined && 
             data.infants !== undefined;
    }
    return true;
  }, {
    message: 'For tour bookings, amount, adults, children, and infants are required',
    path: ['amount'],
  }),
});

const createCustomWalletTopupSchema = z.object({
  body: z.object({
    amount: z.number()
      .positive('Amount must be positive')
      .min(5, 'Minimum topup amount is $5')
      .max(1000, 'Maximum topup amount is $1000')
      .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
    successUrl: z.string().url('Invalid success URL'),
    cancelUrl: z.string().url('Invalid cancel URL'),
  })
});

export const paymentValidation = {
  createCheckoutSessionSchema,
  createCustomWalletTopupSchema,
};
