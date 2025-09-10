import { z } from 'zod';

// Generate presigned URL validation
export const generatePresignedUrlZodSchema = z.object({
  body: z.object({
    fileName: z.string().min(1, "File name is required"),
    fileType: z.string().min(1, "File type is required"),
    purpose: z.enum(['profile-photo', 'cover-photo', 'tour-package'], {
      message: "Purpose must be 'profile-photo', 'cover-photo', or 'tour-package'"
    }),
    fileSize: z.number().positive("File size must be positive").optional(),
  }),
});

// Delete photo validation
export const deletePhotoZodSchema = z.object({
  body: z.object({
    photoUrl: z.string().url("Invalid photo URL"),
  }),
});

// Delete multiple photos validation
export const deleteMultiplePhotosZodSchema = z.object({
  body: z.object({
    photoUrls: z.array(z.string().url("Invalid photo URL")).min(1, "At least one photo URL is required"),
  }),
});

