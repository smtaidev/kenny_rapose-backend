import { z } from "zod";

export const createUserZodSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().min(1, "First name cannot be empty"),
    lastName: z.string().min(1, "Last name cannot be empty"),
    gender: z.enum(["MALE", "FEMALE", "NON_BINARY"]).optional(),
    dateOfBirth: z
      .string()
      .datetime("Invalid date format")
      .optional()
      .or(z.date().optional()),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number cannot exceed 15 characters")
      .optional(),
    address: z
      .string()
      .min(1, "Address cannot be empty")
      .max(200, "Address cannot exceed 200 characters")
      .optional(),
    city: z
      .string()
      .min(1, "City cannot be empty")
      .max(50, "City cannot exceed 50 characters")
      .optional(),
    state: z
      .string()
      .min(1, "State cannot be empty")
      .max(50, "State cannot exceed 50 characters")
      .optional(),
    zip: z
      .string()
      .min(1, "Zip code cannot be empty")
      .max(20, "Zip code cannot exceed 20 characters")
      .optional(),
    country: z
      .string()
      .min(1, "Country cannot be empty")
      .max(50, "Country cannot exceed 50 characters")
      .optional(),
  }),
});

export const loginUserZodSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string(),
  }),
});

export const refreshTokenZodSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token cannot be empty"),
  }),
});

export const googleSignInZodSchema = z.object({
  body: z.object({
    firebaseToken: z.string().min(1, "Firebase token is required"),
  }),
});
