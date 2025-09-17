import { z } from 'zod';

// Daily activity validation schema - array format
const dailyActivitySchema = z.array(
  z.object({
    title: z.string().min(1, 'Day title is required'),
    description: z.string().min(1, 'Day description is required'),
  })
).optional();

export const createTourPackageZodSchema = z.object({
  body: z.object({
    packageName: z.string().min(1, 'Package name is required').max(100, 'Package name too long'),
    about: z.string().min(1, 'About section is required').max(1000, 'About section too long'),
    star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5'),
    packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
    packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
    packagePriceInfant: z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
    pickUp: z.string().min(1, 'Pick up location is required').max(200, 'Pick up location too long').optional(),
    dropOff: z.string().min(1, 'Drop off location is required').max(200, 'Drop off location too long').optional(),
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
    startDay: z.string().datetime('Start day must be a valid date').optional(),
    endDay: z.string().datetime('End day must be a valid date').optional(),
    tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    dailyActivity: dailyActivitySchema.optional(),
    photos: z.array(z.string().url('Photo must be a valid URL')).min(1, 'At least one photo is required').max(5, 'Cannot exceed 5 photos'),
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

// Validation schema for multipart/form-data (with files)
export const createTourPackageWithPhotosZodSchema = z.object({
  body: z.object({
    packageName: z.string().min(1, 'Package name is required').max(100, 'Package name too long'),
    about: z.string().min(1, 'About section is required').max(1000, 'About section too long'),
    star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5'),
    packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
    packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
    packagePriceInfant: z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
    pickUp: z.string().min(1, 'Pick up location is required').max(200, 'Pick up location too long').optional(),
    dropOff: z.string().min(1, 'Drop off location is required').max(200, 'Drop off location too long').optional(),
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
    startDay: z.string().datetime('Start day must be a valid date').optional(),
    endDay: z.string().datetime('End day must be a valid date').optional(),
    tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    dailyActivity: dailyActivitySchema.optional(),
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

export const updateTourPackageWithPhotosZodSchema = z.object({
  body: z.object({
    packageName: z.string().min(1, 'Package name cannot be empty').max(100, 'Package name too long').optional(),
    about: z.string().min(1, 'About section cannot be empty').max(1000, 'About section too long').optional(),
    star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5').optional(),
    packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
    packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
    packagePriceInfant: z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
    pickUp: z.string().min(1, 'Pick up location is required').max(200, 'Pick up location too long').optional(),
    dropOff: z.string().min(1, 'Drop off location is required').max(200, 'Drop off location too long').optional(),
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
    startDay: z.string().datetime('Start day must be a valid date').optional(),
    endDay: z.string().datetime('End day must be a valid date').optional(),
    tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    dailyActivity: dailyActivitySchema.optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }).refine((data) => {
    // Validate age range if both are provided
    if (data.ageRangeFrom && data.ageRangeTo && data.ageRangeFrom >= data.ageRangeTo) {
      return false;
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
});

// Validation schema for deleting photos
export const deletePhotosZodSchema = z.object({
  body: z.object({
    photoUrls: z.array(z.string().url('Photo URL must be valid')).min(1, 'At least one photo URL must be provided').max(5, 'Cannot delete more than 5 photos at once'),
  }),
});

// Mixed approach validation schemas (JSON data + photos as form data)
export const createTourPackageMixedZodSchema = z.object({
  body: z.object({
    data: z.string().min(1, 'Tour package data is required'), // JSON string from form data
  }),
});

export const updateTourPackageMixedZodSchema = z.object({
  body: z.object({
    data: z.string().min(1, 'Tour package data is required'), // JSON string from form data
  }),
  params: z.object({
    id: z.string().min(1, 'Tour package ID is required'),
  }),
});

// Schema for validating the parsed JSON data
export const tourPackageDataSchema = z.object({
  packageName: z.string().min(1, 'Package name is required').max(100, 'Package name too long'),
  about: z.string().min(1, 'About section is required').max(1000, 'About section too long'),
  star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5'),
  packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
  packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
  packagePriceInfant: z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
  pickUp: z.string().min(1, 'Pick up location is required').max(200, 'Pick up location too long').optional(),
  dropOff: z.string().min(1, 'Drop off location is required').max(200, 'Drop off location too long').optional(),
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
  startDay: z.string().datetime('Start day must be a valid date').optional(),
  endDay: z.string().datetime('End day must be a valid date').optional(),
  tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
  dailyActivity: dailyActivitySchema.optional(),
  photos: z.array(z.string().url('Photo must be a valid URL')).max(5, 'Cannot exceed 5 photos').optional().default([]), // Optional photos array - max 5
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
});

// Update schema for validating parsed JSON data (all fields optional)
export const tourPackageUpdateDataSchema = z.object({
  packageName: z.string().min(1, 'Package name cannot be empty').max(100, 'Package name too long').optional(),
  about: z.string().min(1, 'About section cannot be empty').max(1000, 'About section too long').optional(),
  star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5').optional(),
  packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
  packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
  packagePriceInfant: z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
  pickUp: z.string().min(1, 'Pick up location is required').max(200, 'Pick up location too long').optional(),
  dropOff: z.string().min(1, 'Drop off location is required').max(200, 'Drop off location too long').optional(),
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
  startDay: z.string().datetime('Start day must be a valid date').optional(),
  endDay: z.string().datetime('End day must be a valid date').optional(),
  tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
  dailyActivity: dailyActivitySchema.optional(),
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
});

export const updateTourPackageZodSchema = z.object({
  body: z.object({
    packageName: z.string().min(1, 'Package name cannot be empty').max(100, 'Package name too long').optional(),
    about: z.string().min(1, 'About section cannot be empty').max(1000, 'About section too long').optional(),
    star: z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5').optional(),
    packagePriceAdult: z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
    packagePriceChild: z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
    packagePriceInfant: z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
    pickUp: z.string().min(1, 'Pick up location is required').max(200, 'Pick up location too long').optional(),
    dropOff: z.string().min(1, 'Drop off location is required').max(200, 'Drop off location too long').optional(),
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
    startDay: z.string().datetime('Start day must be a valid date').optional(),
    endDay: z.string().datetime('End day must be a valid date').optional(),
    tourType: z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    dailyActivity: dailyActivitySchema.optional(),
    photos: z.array(z.string().url('Photo must be a valid URL')).min(1, 'At least one photo is required').max(5, 'Cannot exceed 5 photos').optional(),
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
