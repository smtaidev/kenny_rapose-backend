"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourPackageZodSchema = exports.tourPackageUpdateDataSchema = exports.tourPackageDataSchema = exports.updateTourPackageMixedZodSchema = exports.createTourPackageMixedZodSchema = exports.deletePhotosZodSchema = exports.updateTourPackageWithPhotosZodSchema = exports.createTourPackageWithPhotosZodSchema = exports.createTourPackageZodSchema = void 0;
const zod_1 = require("zod");
// Daily activity validation schema
const dailyActivitySchema = zod_1.z.record(zod_1.z.string().regex(/^day\d+$/, 'Day key must be in format: day1, day2, day3, etc.'), zod_1.z.object({
    title: zod_1.z.string().min(1, 'Day title is required'),
    description: zod_1.z.string().min(1, 'Day description is required'),
}));
exports.createTourPackageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageName: zod_1.z.string().min(1, 'Package name is required').max(100, 'Package name too long'),
        about: zod_1.z.string().min(1, 'About section is required').max(1000, 'About section too long'),
        star: zod_1.z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5'),
        packagePriceAdult: zod_1.z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
        packagePriceChild: zod_1.z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
        packagePriceInfant: zod_1.z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
        packageCategory: zod_1.z.string().min(1, 'Package category is required').max(50, 'Package category too long'),
        ageRangeFrom: zod_1.z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120'),
        ageRangeTo: zod_1.z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120'),
        whatIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items'),
        whatNotIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items'),
        additionalInfo: zod_1.z.array(zod_1.z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items'),
        cancellationPolicy: zod_1.z.array(zod_1.z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items'),
        help: zod_1.z.string().min(1, 'Help section is required').max(1000, 'Help section too long'),
        breezeCredit: zod_1.z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher'),
        // Legacy fields (optional for backward compatibility)
        totalMembers: zod_1.z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
        pricePerPerson: zod_1.z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
        startDay: zod_1.z.string().datetime('Start day must be a valid date').optional(),
        endDay: zod_1.z.string().datetime('End day must be a valid date').optional(),
        citiesVisited: zod_1.z.array(zod_1.z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities'),
        tourType: zod_1.z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
        activities: zod_1.z.array(zod_1.z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities'),
        dailyActivity: dailyActivitySchema.optional(),
        highlights: zod_1.z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
        description: zod_1.z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
        photos: zod_1.z.array(zod_1.z.string().url('Photo must be a valid URL')).min(1, 'At least one photo is required').max(5, 'Cannot exceed 5 photos'),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
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
exports.createTourPackageWithPhotosZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageName: zod_1.z.string().min(1, 'Package name is required').max(100, 'Package name too long'),
        about: zod_1.z.string().min(1, 'About section is required').max(1000, 'About section too long'),
        star: zod_1.z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5'),
        packagePriceAdult: zod_1.z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
        packagePriceChild: zod_1.z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
        packagePriceInfant: zod_1.z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
        packageCategory: zod_1.z.string().min(1, 'Package category is required').max(50, 'Package category too long'),
        ageRangeFrom: zod_1.z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120'),
        ageRangeTo: zod_1.z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120'),
        whatIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items'),
        whatNotIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items'),
        additionalInfo: zod_1.z.array(zod_1.z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items'),
        cancellationPolicy: zod_1.z.array(zod_1.z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items'),
        help: zod_1.z.string().min(1, 'Help section is required').max(1000, 'Help section too long'),
        breezeCredit: zod_1.z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher'),
        // Legacy fields (optional for backward compatibility)
        totalMembers: zod_1.z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
        pricePerPerson: zod_1.z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
        startDay: zod_1.z.string().datetime('Start day must be a valid date').optional(),
        endDay: zod_1.z.string().datetime('End day must be a valid date').optional(),
        citiesVisited: zod_1.z.array(zod_1.z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities'),
        tourType: zod_1.z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
        activities: zod_1.z.array(zod_1.z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities'),
        dailyActivity: dailyActivitySchema.optional(),
        highlights: zod_1.z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
        description: zod_1.z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
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
exports.updateTourPackageWithPhotosZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageName: zod_1.z.string().min(1, 'Package name cannot be empty').max(100, 'Package name too long').optional(),
        about: zod_1.z.string().min(1, 'About section cannot be empty').max(1000, 'About section too long').optional(),
        star: zod_1.z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5').optional(),
        packagePriceAdult: zod_1.z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
        packagePriceChild: zod_1.z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
        packagePriceInfant: zod_1.z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
        packageCategory: zod_1.z.string().min(1, 'Package category cannot be empty').max(50, 'Package category too long').optional(),
        ageRangeFrom: zod_1.z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120').optional(),
        ageRangeTo: zod_1.z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120').optional(),
        whatIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items').optional(),
        whatNotIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items').optional(),
        additionalInfo: zod_1.z.array(zod_1.z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items').optional(),
        cancellationPolicy: zod_1.z.array(zod_1.z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items').optional(),
        help: zod_1.z.string().min(1, 'Help section cannot be empty').max(1000, 'Help section too long').optional(),
        breezeCredit: zod_1.z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher').optional(),
        // Legacy fields (optional for backward compatibility)
        totalMembers: zod_1.z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
        pricePerPerson: zod_1.z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
        startDay: zod_1.z.string().datetime('Start day must be a valid date').optional(),
        endDay: zod_1.z.string().datetime('End day must be a valid date').optional(),
        citiesVisited: zod_1.z.array(zod_1.z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities').optional(),
        tourType: zod_1.z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
        activities: zod_1.z.array(zod_1.z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities').optional(),
        dailyActivity: dailyActivitySchema.optional(),
        highlights: zod_1.z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
        description: zod_1.z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
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
exports.deletePhotosZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        photoUrls: zod_1.z.array(zod_1.z.string().url('Photo URL must be valid')).min(1, 'At least one photo URL must be provided').max(5, 'Cannot delete more than 5 photos at once'),
    }),
});
// Mixed approach validation schemas (JSON data + photos as form data)
exports.createTourPackageMixedZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        data: zod_1.z.string().min(1, 'Tour package data is required'), // JSON string from form data
    }),
});
exports.updateTourPackageMixedZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        data: zod_1.z.string().min(1, 'Tour package data is required'), // JSON string from form data
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Tour package ID is required'),
    }),
});
// Schema for validating the parsed JSON data
exports.tourPackageDataSchema = zod_1.z.object({
    packageName: zod_1.z.string().min(1, 'Package name is required').max(100, 'Package name too long'),
    about: zod_1.z.string().min(1, 'About section is required').max(1000, 'About section too long'),
    star: zod_1.z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5'),
    packagePriceAdult: zod_1.z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
    packagePriceChild: zod_1.z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
    packagePriceInfant: zod_1.z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
    packageCategory: zod_1.z.string().min(1, 'Package category is required').max(50, 'Package category too long'),
    ageRangeFrom: zod_1.z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120'),
    ageRangeTo: zod_1.z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120'),
    whatIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items'),
    whatNotIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items'),
    additionalInfo: zod_1.z.array(zod_1.z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items'),
    cancellationPolicy: zod_1.z.array(zod_1.z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items'),
    help: zod_1.z.string().min(1, 'Help section is required').max(1000, 'Help section too long'),
    breezeCredit: zod_1.z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher'),
    // Legacy fields (optional for backward compatibility)
    totalMembers: zod_1.z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
    pricePerPerson: zod_1.z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
    startDay: zod_1.z.string().datetime('Start day must be a valid date').optional(),
    endDay: zod_1.z.string().datetime('End day must be a valid date').optional(),
    citiesVisited: zod_1.z.array(zod_1.z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities'),
    tourType: zod_1.z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    activities: zod_1.z.array(zod_1.z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities'),
    dailyActivity: dailyActivitySchema.optional(),
    highlights: zod_1.z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
    description: zod_1.z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
    photos: zod_1.z.array(zod_1.z.string().url('Photo must be a valid URL')).max(5, 'Cannot exceed 5 photos').optional().default([]), // Optional photos array - max 5
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
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
exports.tourPackageUpdateDataSchema = zod_1.z.object({
    packageName: zod_1.z.string().min(1, 'Package name cannot be empty').max(100, 'Package name too long').optional(),
    about: zod_1.z.string().min(1, 'About section cannot be empty').max(1000, 'About section too long').optional(),
    star: zod_1.z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5').optional(),
    packagePriceAdult: zod_1.z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
    packagePriceChild: zod_1.z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
    packagePriceInfant: zod_1.z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
    packageCategory: zod_1.z.string().min(1, 'Package category cannot be empty').max(50, 'Package category too long').optional(),
    ageRangeFrom: zod_1.z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120').optional(),
    ageRangeTo: zod_1.z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120').optional(),
    whatIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items').optional(),
    whatNotIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items').optional(),
    additionalInfo: zod_1.z.array(zod_1.z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items').optional(),
    cancellationPolicy: zod_1.z.array(zod_1.z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items').optional(),
    help: zod_1.z.string().min(1, 'Help section cannot be empty').max(1000, 'Help section too long').optional(),
    breezeCredit: zod_1.z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher').optional(),
    // Legacy fields (optional for backward compatibility)
    totalMembers: zod_1.z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
    pricePerPerson: zod_1.z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
    startDay: zod_1.z.string().datetime('Start day must be a valid date').optional(),
    endDay: zod_1.z.string().datetime('End day must be a valid date').optional(),
    citiesVisited: zod_1.z.array(zod_1.z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities').optional(),
    tourType: zod_1.z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
    activities: zod_1.z.array(zod_1.z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities').optional(),
    dailyActivity: dailyActivitySchema.optional(),
    highlights: zod_1.z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
    description: zod_1.z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
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
exports.updateTourPackageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageName: zod_1.z.string().min(1, 'Package name cannot be empty').max(100, 'Package name too long').optional(),
        about: zod_1.z.string().min(1, 'About section cannot be empty').max(1000, 'About section too long').optional(),
        star: zod_1.z.number().min(0, 'Star rating must be 0 or higher').max(5, 'Star rating cannot exceed 5').optional(),
        packagePriceAdult: zod_1.z.number().positive('Adult package price must be positive').max(100000, 'Adult package price cannot exceed 100000').optional(),
        packagePriceChild: zod_1.z.number().positive('Child package price must be positive').max(100000, 'Child package price cannot exceed 100000').optional(),
        packagePriceInfant: zod_1.z.number().min(0, 'Infant package price must be 0 or higher').max(100000, 'Infant package price cannot exceed 100000').optional(),
        packageCategory: zod_1.z.string().min(1, 'Package category cannot be empty').max(50, 'Package category too long').optional(),
        ageRangeFrom: zod_1.z.number().int('Age range from must be a whole number').min(0, 'Age range from must be 0 or higher').max(120, 'Age range from cannot exceed 120').optional(),
        ageRangeTo: zod_1.z.number().int('Age range to must be a whole number').min(0, 'Age range to must be 0 or higher').max(120, 'Age range to cannot exceed 120').optional(),
        whatIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Included item cannot be empty')).min(1, 'At least one included item must be specified').max(50, 'Cannot exceed 50 included items').optional(),
        whatNotIncluded: zod_1.z.array(zod_1.z.string().min(1, 'Excluded item cannot be empty')).min(1, 'At least one excluded item must be specified').max(50, 'Cannot exceed 50 excluded items').optional(),
        additionalInfo: zod_1.z.array(zod_1.z.string().min(1, 'Additional info item cannot be empty')).max(20, 'Cannot exceed 20 additional info items').optional(),
        cancellationPolicy: zod_1.z.array(zod_1.z.string().min(1, 'Cancellation policy item cannot be empty')).min(1, 'At least one cancellation policy must be specified').max(20, 'Cannot exceed 20 cancellation policy items').optional(),
        help: zod_1.z.string().min(1, 'Help section cannot be empty').max(1000, 'Help section too long').optional(),
        breezeCredit: zod_1.z.number().int('Breeze credit must be a whole number').min(0, 'Breeze credit must be 0 or higher').optional(),
        // Legacy fields (optional for backward compatibility)
        totalMembers: zod_1.z.number().int('Total members must be a whole number').positive('Total members must be positive').max(1000, 'Total members cannot exceed 1000').optional(),
        pricePerPerson: zod_1.z.number().positive('Price per person must be positive').max(10000, 'Price per person cannot exceed 10000').optional(),
        startDay: zod_1.z.string().datetime('Start day must be a valid date').optional(),
        endDay: zod_1.z.string().datetime('End day must be a valid date').optional(),
        citiesVisited: zod_1.z.array(zod_1.z.string().min(1, 'City name cannot be empty')).min(1, 'At least one city must be specified').max(50, 'Cannot exceed 50 cities').optional(),
        tourType: zod_1.z.string().min(1, 'Tour type cannot be empty').max(50, 'Tour type too long').optional(),
        activities: zod_1.z.array(zod_1.z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity must be specified').max(100, 'Cannot exceed 100 activities').optional(),
        dailyActivity: dailyActivitySchema.optional(),
        highlights: zod_1.z.string().min(1, 'Highlights cannot be empty').max(500, 'Highlights too long').optional(),
        description: zod_1.z.string().min(1, 'Description cannot be empty').max(2000, 'Description too long').optional(),
        photos: zod_1.z.array(zod_1.z.string().url('Photo must be a valid URL')).min(1, 'At least one photo is required').max(5, 'Cannot exceed 5 photos').optional(),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
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
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Tour package ID is required'),
    }),
});
