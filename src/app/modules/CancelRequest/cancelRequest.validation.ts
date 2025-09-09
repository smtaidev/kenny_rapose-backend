import { z } from 'zod';

const createCancelRequestZodSchema = z.object({
  body: z.object({
    tourBookingId: z.string().min(1, 'Tour booking ID is required'),
  }),
});

const updateCancelRequestStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  }),
});

const getCancelRequestsZodSchema = z.object({
  query: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    page: z.string().optional().transform((str) => str ? parseInt(str, 10) : 1),
    limit: z.string().optional().transform((str) => str ? parseInt(str, 10) : 20),
  }),
});

export { 
  createCancelRequestZodSchema, 
  updateCancelRequestStatusZodSchema,
  getCancelRequestsZodSchema 
};
