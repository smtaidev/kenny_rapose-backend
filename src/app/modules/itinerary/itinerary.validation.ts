import { z } from 'zod';

const createItinerarySchema = z.object({
  body: z.object({
    userEmail: z.string().email('Invalid email format'),
    userFirstName: z.string().min(1, 'First name is required'),
    userLastName: z.string().min(1, 'Last name is required'),
    goingWith: z.string().min(1, 'Going with is required'),
    total_adults: z.number().int().min(1, 'At least 1 adult is required'),
    total_children: z.number().int().min(0, 'Children count cannot be negative'),
    destination: z.string().min(1, 'Destination is required'),
    location: z.string().min(1, 'Location is required'),
    departure_date: z.string().min(1, 'Departure date is required'),
    return_date: z.string().min(1, 'Return date is required'),
    amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
    activities: z.array(z.string()).min(1, 'At least one activity is required'),
    pacing: z.array(z.string()).min(1, 'At least one pacing preference is required'),
    food: z.array(z.string()).min(1, 'At least one food preference is required'),
    special_note: z.string().min(1, 'Special note is required'),
  }),
});

const editActivitySchema = z.object({
  body: z.object({
    itinerary_id: z.string().uuid('Invalid itinerary ID format'),
    activity_id: z.string().min(1, 'Activity ID is required'),
    user_change: z.string().min(1, 'User change description is required'),
  }),
});

const updateActivitySchema = z.object({
  body: z.object({
    itinerary_id: z.string().uuid('Invalid itinerary ID format'),
    activity_id: z.string().min(1, 'Activity ID is required'),
    selected_option: z.number().int().min(1, 'Selected option must be at least 1'),
    alternative_options: z.array(
      z.object({
        option: z.number().int(),
        time: z.string(),
        title: z.string(),
        description: z.string(),
        place: z.string(),
        keyword: z.string(),
      })
    ).min(1, 'At least one alternative option is required'),
  }),
});

export const itineraryValidation = {
  createItinerarySchema,
  editActivitySchema,
  updateActivitySchema,
};
