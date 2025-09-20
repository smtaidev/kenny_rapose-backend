import { z } from 'zod';

const createCheckoutSessionSchema = z.object({
  body: z.object({
    packageId: z.string().uuid('Invalid package ID'),
    packageType: z.enum(['ai-credit', 'breeze-wallet', 'tour']),
    successUrl: z.string().transform((val) => {
      // Auto-add https:// if not present
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        return `https://${val}`;
      }
      return val;
    }).pipe(z.string().url('Invalid success URL')),
    cancelUrl: z.string().transform((val) => {
      // Auto-add https:// if not present
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        return `https://${val}`;
      }
      return val;
    }).pipe(z.string().url('Invalid cancel URL')),
    // Tour booking specific fields
    amount: z.union([z.number(), z.string()]).transform((val) => {
      // Convert string to number if needed
      if (typeof val === 'string') {
        const num = parseFloat(val);
        if (isNaN(num)) throw new Error('Amount must be a valid number');
        return num;
      }
      return val;
    }).pipe(z.number().positive('Amount must be positive')).optional(),
    adults: z.union([z.number(), z.string()]).transform((val) => {
      // Convert string to number if needed
      if (typeof val === 'string') {
        const num = parseInt(val);
        if (isNaN(num)) throw new Error('Adults must be a valid number');
        return num;
      }
      return val;
    }).pipe(z.number().int().min(0, 'Adults count cannot be negative')).optional(),
    children: z.union([z.number(), z.string()]).transform((val) => {
      // Convert string to number if needed
      if (typeof val === 'string') {
        const num = parseInt(val);
        if (isNaN(num)) throw new Error('Children must be a valid number');
        return num;
      }
      return val;
    }).pipe(z.number().int().min(0, 'Children count cannot be negative')).optional(),
    infants: z.union([z.number(), z.string()]).transform((val) => {
      // Convert string to number if needed
      if (typeof val === 'string') {
        const num = parseInt(val);
        if (isNaN(num)) throw new Error('Infants must be a valid number');
        return num;
      }
      return val;
    }).pipe(z.number().int().min(0, 'Infants count cannot be negative')).optional(),
    travelDate: z.string().transform((val) => {
      // Handle different date formats
      if (val.includes('T')) {
        // Already in ISO format
        return val;
      } else if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // YYYY-MM-DD format, add time
        return `${val}T00:00:00.000Z`;
      } else {
        // Try to parse as date and convert to ISO
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format. Use YYYY-MM-DD or ISO format');
        }
        return date.toISOString();
      }
    }).pipe(z.string().datetime('Invalid travel date')).optional(),
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
