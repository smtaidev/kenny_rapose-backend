import { z } from 'zod';

export const subscribeZodSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
  }),
});
