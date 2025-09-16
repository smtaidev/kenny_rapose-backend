"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourPackageService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const s3Upload_1 = require("../../utils/s3Upload");
//=====================Create Tour Package=====================
const createTourPackage = (packageData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if package with same name already exists
    const existingPackage = yield prisma_1.default.tourPackage.findFirst({
        where: {
            packageName: packageData.packageName,
            deletedAt: null,
        },
    });
    if (existingPackage) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Tour package with this name already exists');
    }
    // Create new package
    const newPackage = yield prisma_1.default.tourPackage.create({
        data: Object.assign(Object.assign(Object.assign({}, packageData), (packageData.startDay && { startDay: new Date(packageData.startDay) })), (packageData.endDay && { endDay: new Date(packageData.endDay) })),
        select: {
            id: true,
            packageName: true,
            about: true,
            star: true,
            packagePriceAdult: true,
            packagePriceChild: true,
            packageCategory: true,
            ageRangeFrom: true,
            ageRangeTo: true,
            whatIncluded: true,
            whatNotIncluded: true,
            additionalInfo: true,
            cancellationPolicy: true,
            help: true,
            breezeCredit: true,
            // Legacy fields
            totalMembers: true,
            pricePerPerson: true,
            startDay: true,
            endDay: true,
            citiesVisited: true,
            tourType: true,
            activities: true,
            dailyActivity: true,
            highlights: true,
            description: true,
            photos: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return newPackage;
});
//=====================Update Tour Package=====================
const updateTourPackage = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if package exists and is not deleted
    const existingPackage = yield prisma_1.default.tourPackage.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingPackage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Tour package not found');
    }
    // If name is being updated, check for duplicates
    if (updateData.packageName && updateData.packageName !== existingPackage.packageName) {
        const duplicatePackage = yield prisma_1.default.tourPackage.findFirst({
            where: {
                packageName: updateData.packageName,
                id: { not: id },
                deletedAt: null,
            },
        });
        if (duplicatePackage) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, 'Tour package with this name already exists');
        }
    }
    // Prepare update data
    const dataToUpdate = Object.assign({}, updateData);
    if (updateData.startDay) {
        dataToUpdate.startDay = new Date(updateData.startDay);
    }
    if (updateData.endDay) {
        dataToUpdate.endDay = new Date(updateData.endDay);
    }
    // Update package
    const updatedPackage = yield prisma_1.default.tourPackage.update({
        where: { id },
        data: dataToUpdate,
        select: {
            id: true,
            packageName: true,
            about: true,
            star: true,
            packagePriceAdult: true,
            packagePriceChild: true,
            packageCategory: true,
            ageRangeFrom: true,
            ageRangeTo: true,
            whatIncluded: true,
            whatNotIncluded: true,
            additionalInfo: true,
            cancellationPolicy: true,
            help: true,
            breezeCredit: true,
            // Legacy fields
            totalMembers: true,
            pricePerPerson: true,
            startDay: true,
            endDay: true,
            citiesVisited: true,
            tourType: true,
            activities: true,
            dailyActivity: true,
            highlights: true,
            description: true,
            photos: true,
            status: true,
            deletedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedPackage;
});
//=====================Delete Tour Package (Soft Delete)=====================
const deleteTourPackage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if package exists and is not already deleted
    const existingPackage = yield prisma_1.default.tourPackage.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingPackage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Tour package not found');
    }
    // Soft delete the package
    yield prisma_1.default.tourPackage.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });
    return { message: 'Tour package deleted successfully' };
});
//=====================Get Tour Package by ID=====================
const getTourPackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourPackage = yield prisma_1.default.tourPackage.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        select: {
            id: true,
            packageName: true,
            about: true,
            star: true,
            packagePriceAdult: true,
            packagePriceChild: true,
            packageCategory: true,
            ageRangeFrom: true,
            ageRangeTo: true,
            whatIncluded: true,
            whatNotIncluded: true,
            additionalInfo: true,
            cancellationPolicy: true,
            help: true,
            breezeCredit: true,
            // Legacy fields
            totalMembers: true,
            pricePerPerson: true,
            startDay: true,
            endDay: true,
            citiesVisited: true,
            tourType: true,
            activities: true,
            dailyActivity: true,
            highlights: true,
            description: true,
            photos: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!tourPackage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Tour package not found');
    }
    return tourPackage;
});
//=====================Get All Tour Packages=====================
const getAllTourPackages = () => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield prisma_1.default.tourPackage.findMany({
        where: {
            deletedAt: null,
        },
        select: {
            id: true,
            packageName: true,
            about: true,
            star: true,
            packagePriceAdult: true,
            packagePriceChild: true,
            packageCategory: true,
            ageRangeFrom: true,
            ageRangeTo: true,
            whatIncluded: true,
            whatNotIncluded: true,
            additionalInfo: true,
            cancellationPolicy: true,
            help: true,
            breezeCredit: true,
            // Legacy fields
            totalMembers: true,
            pricePerPerson: true,
            startDay: true,
            endDay: true,
            citiesVisited: true,
            tourType: true,
            activities: true,
            dailyActivity: true,
            highlights: true,
            description: true,
            photos: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return packages;
});
//=====================Photo Management Functions=====================
// Upload multiple photos for tour package
const uploadTourPackagePhotos = (tourPackageId, files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify tour package exists
        const tourPackage = yield prisma_1.default.tourPackage.findUnique({
            where: { id: tourPackageId },
            select: { id: true, packageName: true, photos: true }
        });
        if (!tourPackage) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Tour package not found');
        }
        console.log(`🔧 Uploading ${files.length} photos for tour package: ${tourPackage.packageName}`);
        // Upload all files to S3
        const uploadPromises = files.map(file => (0, s3Upload_1.uploadFileToS3)(file, 'tour-package'));
        const uploadedUrls = yield Promise.all(uploadPromises);
        console.log(`✅ Successfully uploaded ${uploadedUrls.length} photos to S3`);
        // Update tour package with new photos
        const updatedPackage = yield prisma_1.default.tourPackage.update({
            where: { id: tourPackageId },
            data: {
                photos: [...tourPackage.photos, ...uploadedUrls]
            },
            select: {
                id: true,
                packageName: true,
                photos: true
            }
        });
        console.log(`✅ Tour package photos updated. Total photos: ${updatedPackage.photos.length}`);
        return uploadedUrls;
    }
    catch (error) {
        console.error('❌ Tour package photo upload error:', error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to upload tour package photos. Please try again.');
    }
});
// Replace all photos for tour package
const replaceTourPackagePhotos = (tourPackageId, files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify tour package exists
        const tourPackage = yield prisma_1.default.tourPackage.findUnique({
            where: { id: tourPackageId },
            select: { id: true, packageName: true, photos: true }
        });
        if (!tourPackage) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Tour package not found');
        }
        console.log(`🔧 Replacing photos for tour package: ${tourPackage.packageName}`);
        console.log(`🔧 Old photos count: ${tourPackage.photos.length}, New files count: ${files.length}`);
        // Delete old photos from S3
        if (tourPackage.photos.length > 0) {
            console.log('🗑️ Deleting old photos from S3...');
            const deletePromises = tourPackage.photos.map(photoUrl => (0, s3Upload_1.deleteFileFromS3)(photoUrl));
            yield Promise.all(deletePromises);
            console.log('✅ Old photos deleted from S3');
        }
        // Upload new files to S3
        const uploadPromises = files.map(file => (0, s3Upload_1.uploadFileToS3)(file, 'tour-package'));
        const uploadedUrls = yield Promise.all(uploadPromises);
        console.log(`✅ Successfully uploaded ${uploadedUrls.length} new photos to S3`);
        // Update tour package with new photos
        const updatedPackage = yield prisma_1.default.tourPackage.update({
            where: { id: tourPackageId },
            data: {
                photos: uploadedUrls
            },
            select: {
                id: true,
                packageName: true,
                photos: true
            }
        });
        console.log(`✅ Tour package photos replaced. New photos count: ${updatedPackage.photos.length}`);
        return uploadedUrls;
    }
    catch (error) {
        console.error('❌ Tour package photo replacement error:', error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to replace tour package photos. Please try again.');
    }
});
// Delete specific photos from tour package
const deleteTourPackagePhotos = (tourPackageId, photoUrls) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify tour package exists
        const tourPackage = yield prisma_1.default.tourPackage.findUnique({
            where: { id: tourPackageId },
            select: { id: true, packageName: true, photos: true }
        });
        if (!tourPackage) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Tour package not found');
        }
        console.log(`🔧 Deleting ${photoUrls.length} photos from tour package: ${tourPackage.packageName}`);
        // Delete photos from S3
        const deletePromises = photoUrls.map(photoUrl => (0, s3Upload_1.deleteFileFromS3)(photoUrl));
        yield Promise.all(deletePromises);
        // Remove photos from database
        const remainingPhotos = tourPackage.photos.filter(photo => !photoUrls.includes(photo));
        yield prisma_1.default.tourPackage.update({
            where: { id: tourPackageId },
            data: {
                photos: remainingPhotos
            }
        });
        console.log(`✅ Successfully deleted ${photoUrls.length} photos. Remaining photos: ${remainingPhotos.length}`);
    }
    catch (error) {
        console.error('❌ Tour package photo deletion error:', error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete tour package photos. Please try again.');
    }
});
// Create tour package with photos
const createTourPackageWithPhotos = (packageData, files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`🔧 Creating tour package with ${files.length} photos`);
        // Upload photos first
        const uploadPromises = files.map(file => (0, s3Upload_1.uploadFileToS3)(file, 'tour-package'));
        const uploadedUrls = yield Promise.all(uploadPromises);
        // Create tour package with photo URLs
        const newPackage = yield prisma_1.default.tourPackage.create({
            data: Object.assign(Object.assign(Object.assign(Object.assign({}, packageData), { photos: uploadedUrls }), (packageData.startDay && { startDay: new Date(packageData.startDay) })), (packageData.endDay && { endDay: new Date(packageData.endDay) })),
            select: {
                id: true,
                packageName: true,
                about: true,
                star: true,
                packagePriceAdult: true,
                packagePriceChild: true,
                packageCategory: true,
                ageRangeFrom: true,
                ageRangeTo: true,
                whatIncluded: true,
                whatNotIncluded: true,
                additionalInfo: true,
                cancellationPolicy: true,
                help: true,
                breezeCredit: true,
                // Legacy fields
                totalMembers: true,
                pricePerPerson: true,
                startDay: true,
                endDay: true,
                citiesVisited: true,
                tourType: true,
                activities: true,
                dailyActivity: true,
                highlights: true,
                description: true,
                photos: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        console.log(`✅ Tour package created successfully with ${uploadedUrls.length} photos`);
        return newPackage;
    }
    catch (error) {
        console.error('❌ Tour package creation with photos error:', error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create tour package with photos. Please try again.');
    }
});
// Update tour package with photos
const updateTourPackageWithPhotos = (id, updateData, files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`🔧 Updating tour package with ${files.length} new photos`);
        // Get current tour package
        const currentPackage = yield prisma_1.default.tourPackage.findUnique({
            where: { id },
            select: { id: true, packageName: true, photos: true }
        });
        if (!currentPackage) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Tour package not found');
        }
        // Upload new photos
        const uploadPromises = files.map(file => (0, s3Upload_1.uploadFileToS3)(file, 'tour-package'));
        const uploadedUrls = yield Promise.all(uploadPromises);
        // Update tour package with new photos added to existing ones
        const updatedPackage = yield prisma_1.default.tourPackage.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign(Object.assign({}, updateData), { photos: [...currentPackage.photos, ...uploadedUrls] }), (updateData.startDay && { startDay: new Date(updateData.startDay) })), (updateData.endDay && { endDay: new Date(updateData.endDay) })),
            select: {
                id: true,
                packageName: true,
                about: true,
                star: true,
                packagePriceAdult: true,
                packagePriceChild: true,
                packageCategory: true,
                ageRangeFrom: true,
                ageRangeTo: true,
                whatIncluded: true,
                whatNotIncluded: true,
                additionalInfo: true,
                cancellationPolicy: true,
                help: true,
                breezeCredit: true,
                // Legacy fields
                totalMembers: true,
                pricePerPerson: true,
                startDay: true,
                endDay: true,
                citiesVisited: true,
                tourType: true,
                activities: true,
                dailyActivity: true,
                highlights: true,
                description: true,
                photos: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        console.log(`✅ Tour package updated successfully. Total photos: ${updatedPackage.photos.length}`);
        return updatedPackage;
    }
    catch (error) {
        console.error('❌ Tour package update with photos error:', error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update tour package with photos. Please try again.');
    }
});
exports.TourPackageService = {
    createTourPackage,
    updateTourPackage,
    deleteTourPackage,
    getTourPackageById,
    getAllTourPackages,
    // Photo management functions
    uploadTourPackagePhotos,
    replaceTourPackagePhotos,
    deleteTourPackagePhotos,
    createTourPackageWithPhotos,
    updateTourPackageWithPhotos,
};
