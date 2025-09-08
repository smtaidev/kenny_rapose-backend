import { z } from 'zod';

// User Assistance Request Schema
export const createUserAssistanceZodSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
    phoneNumber: z.string().min(1, 'Phone number is required').max(20, 'Phone number must be less than 20 characters'),
    email: z.string().email('Invalid email address'),
    concern: z.string().min(10, 'Concern must be at least 10 characters').max(1000, 'Concern must be less than 1000 characters'),
  }),
});

// TypeScript interfaces
export interface ICreateUserAssistance {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  concern: string;
}

export interface IUserAssistanceResponse {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  concern: string;
  status: string;
  response: string | null;
  createdAt: Date;
  updatedAt: Date;
}
