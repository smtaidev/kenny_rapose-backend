import { z } from 'zod';

const createTourBookingZodSchema = z.object({
  body: z.object({
    tourPackageId: z.string().min(1, 'Tour package ID is required'),
    adults: z.number().min(0, 'Adults count cannot be negative'),
    children: z.number().min(0, 'Children count cannot be negative'),
    infants: z.number().min(0, 'Infants count cannot be negative'),
    travelDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  }),
});

const updateTourBookingZodSchema = z.object({
  body: z.object({
    adults: z.number().min(0, 'Adults count cannot be negative').optional(),
    children: z.number().min(0, 'Children count cannot be negative').optional(),
    infants: z.number().min(0, 'Infants count cannot be negative').optional(),
    travelDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  }),
});

export { createTourBookingZodSchema, updateTourBookingZodSchema };
