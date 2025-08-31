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
exports.TourPackageService = {
    createTourPackage,
    updateTourPackage,
    deleteTourPackage,
    getTourPackageById,
    getAllTourPackages,
};
