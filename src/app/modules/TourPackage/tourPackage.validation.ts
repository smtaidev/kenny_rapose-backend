import { z } from 'zod';

// Daily activity validation schema
const dailyActivitySchema = z.record(
  z.string().regex(/^day\d+$/, 'Day key must be in format: day1, day2, day3, etc.'),
  z.object({
    title: z.string().min(1, 'Day title is required'),
    description: z.string().min(1, 'Day description is required'),
  })
);

export const createTourPackageZodSchema = z.object({
  body: z.object({
    packageName: z.string().min(1, 'Package name is required').max(100, 'Package name too long'),
    about: z.string().min(1, 'About section is required').max(1000, 'About section too long'),
    star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5'),
    packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000'),
    packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000'),
    packageCategory: z.string().min(1, 'Package category is required').max(50, 'Package category too long'),
    ageRangeFrom: z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120'),
    ageRangeTo: z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120'),
    whatIncluded: z.array(z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items'),
    whatNotIncluded: z.array(z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items'),
    additionalInfo: z.array(z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items'),
    cancellationPolicy: z.array(z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items'),
    help: z.string().min(1, 'Help section is required').max(1000, 'Help section too long'),
    breezeCredit: z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher'),
    
    // Legacy fields (optional for backward compatibility)
    totalMembers: z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
    pricePerPerson: z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
    startDay: z.string().datetime('Start day must be a valid date').optional(),
    endDay: z.string().datetime('End day must be a valid date').optional(),
    citiesVisited: z.array(z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities'),
    tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    activities: z.array(z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities'),
    dailyActivity: dailyActivitySchema.optional(),
    highlights: z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
    description: z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
    photos: z.array(z.string().url('Photo must be a valid URL')).min(1, 'At least one photo is required').max(20, 'Cannot exceed 20 photos'),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  }).refine((data) => {
    // Validate age range
    if (data.ageRangeFrom >= data.ageRangeTo) {
      return false;
    }
    return true;
  }, {
    message: 'Age range "to" must be greater than "from"',
    path: ['ageRangeTo'],
  }).refine((data) => {
    // Validate start/end dates if provided
    if (data.startDay && data.endDay) {
      const startDate = new Date(data.startDay);
      const endDate = new Date(data.endDay);
      return endDate > startDate;
    }
    return true;
  }, {
    message: 'End day must be after start day',
    path: ['endDay'],
  }),
});

export const updateTourPackageZodSchema = z.object({
  body: z.object({
    packageName: z.string().min(1, 'Package name cannot be empty').max(100, 'Package name too long').optional(),
    about: z.string().min(1, 'About section cannot be empty').max(1000, 'About section too long').optional(),
    star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5').optional(),
    packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
    packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
    packageCategory: z.string().min(1, 'Package category cannot be empty').max(50, 'Package category too long').optional(),
    ageRangeFrom: z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120').optional(),
    ageRangeTo: z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120').optional(),
    whatIncluded: z.array(z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items').optional(),
    whatNotIncluded: z.array(z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items').optional(),
    additionalInfo: z.array(z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items').optional(),
    cancellationPolicy: z.array(z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items').optional(),
    help: z.string().min(1, 'Help section cannot be empty').max(1000, 'Help section too long').optional(),
    breezeCredit: z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher').optional(),
    
    // Legacy fields (optional for backward compatibility)
    totalMembers: z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
    pricePerPerson: z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
    startDay: z.string().datetime('Start day must be a valid date').optional(),
    endDay: z.string().datetime('End day must be a valid date').optional(),
    citiesVisited: z.array(z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities').optional(),
    tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    activities: z.array(z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities').optional(),
    dailyActivity: dailyActivitySchema.optional(),
    highlights: z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
    description: z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
    photos: z.array(z.string().url('Photo must be a valid URL')).min(1, 'At least one photo is required').max(20, 'Cannot exceed 20 photos').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }).refine((data) => {
    // Validate age range if both are provided
    if (data.ageRangeFrom !== undefined && data.ageRangeTo !== undefined) {
      if (data.ageRangeFrom >= data.ageRangeTo) {
        return false;
      }
    }
    return true;
  }, {
    message: 'Age range "to" must be greater than "from"',
    path: ['ageRangeTo'],
  }).refine((data) => {
    // Validate start/end dates if both are provided
    if (data.startDay && data.endDay) {
      const startDate = new Date(data.startDay);
      const endDate = new Date(data.endDay);
      return endDate > startDate;
    }
    return true;
  }, {
    message: 'End day must be after start day',
    path: ['endDay'],
  }),
  params: z.object({
    id: z.string().min(1, 'Tour package ID is required'),
  }),
});
