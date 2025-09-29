import { z } from "zod";

const createItinerarySchema = z.object({
  body: z.object({
    total_adults: z.number().int().min(1, "At least 1 adult is required"),
    total_children: z
      .number()
      .int()
      .min(0, "Children count cannot be negative"),
    destination: z.string().min(1, "Destination is required"),
    location: z.string().min(1, "Location is required"),
    departure_date: z.string().min(1, "Departure date is required"),
    return_date: z.string().min(1, "Return date is required"),
    amenities: z.array(z.string()).min(1, "At least one amenity is required"),
    activities: z.array(z.string()).min(1, "At least one activity is required"),
    pacing: z
      .array(z.string())
      .min(1, "At least one pacing preference is required"),
    food: z
      .array(z.string())
      .min(1, "At least one food preference is required"),
    special_note: z.string().min(1, "Special note is required"),
  }),
});

const updateActivitySchema = z.object({
  body: z.object({
    itinerary_id: z.string().uuid("Invalid itinerary ID format"),
    activity_id: z.string().min(1, "Activity ID is required"),
    day_uuid: z.string().min(1, "Day UUID is required"),
    activity: z.object({
      time: z.string().min(1, "Activity time is required"),
      title: z
        .string()
        .min(1, "Activity title is required")
        .max(200, "Title too long"),
      description: z
        .string()
        .min(1, "Activity description is required")
        .max(1000, "Description too long"),
      place: z
        .string()
        .min(1, "Activity place is required")
        .max(200, "Place name too long"),
      keyword: z
        .string()
        .min(1, "Activity keyword is required")
        .max(50, "Keyword too long"),
    }),
  }),
});

const addActivitySchema = z.object({
  body: z.object({
    itinerary_id: z.string().uuid("Invalid itinerary ID format"),
    day_uuid: z.string().min(1, "Day UUID is required"),
    activity: z.object({
      time: z.string().min(1, "Activity time is required"),
      title: z
        .string()
        .min(1, "Activity title is required")
        .max(200, "Title too long"),
      description: z
        .string()
        .min(1, "Activity description is required")
        .max(1000, "Description too long"),
      place: z
        .string()
        .min(1, "Activity place is required")
        .max(200, "Place name too long"),
      keyword: z
        .string()
        .min(1, "Activity keyword is required")
        .max(50, "Keyword too long"),
    }),
  }),
});

const deleteActivitySchema = z.object({
  body: z.object({
    itinerary_id: z.string().uuid("Invalid itinerary ID format"),
    day_uuid: z.string().min(1, "Day UUID is required"),
    activity_id: z.string().min(1, "Activity ID is required"),
  }),
});

const deleteItinerarySchema = z.object({
  body: z.object({
    itinerary_id: z.string().uuid("Invalid itinerary ID format"),
  }),
});

export const itineraryValidation = {
  createItinerarySchema,
  updateActivitySchema,
  addActivitySchema,
  deleteActivitySchema,
  deleteItinerarySchema,
};
