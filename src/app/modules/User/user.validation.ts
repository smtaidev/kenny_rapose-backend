import { z } from "zod";

// User profile update validation
export const updateUserProfileZodSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name cannot be empty").optional(),
    lastName: z.string().min(1, "Last name cannot be empty").optional(),
    gender: z.enum(["MALE", "FEMALE", "NON_BINARY"]).optional(),
    dateOfBirth: z
      .date({ message: "Invalid date format" })
      .optional()
      .or(z.date().optional()),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number cannot exceed 15 characters")
      .optional(),
    address: z.string().min(1, "Address cannot be empty").optional(),
    city: z.string().min(1, "City cannot be empty").optional(),
    state: z.string().min(1, "State cannot be empty").optional(),
    zip: z
      .string()
      .min(1, "Zip code cannot be empty")
      .max(20, "Zip code cannot exceed 20 characters")
      .optional(),
  }),
});

// OTP validation schemas
export const requestOtpZodSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").min(1, "Email cannot be empty"),
  }),
});

export const verifyOtpZodSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").min(1, "Email cannot be empty"),
    otp: z
      .string()
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d{6}$/, "OTP must contain only numbers"),
  }),
});

export const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const resetPasswordZodSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").min(1, "Email cannot be empty"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// User role update validation
export const updateUserRoleZodSchema = z.object({
  body: z.object({
    role: z
      .enum(["USER", "ADMIN", "SUPER_ADMIN"]),
  }),
});