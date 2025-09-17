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
exports.TourPackageController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tourPackage_service_1 = require("./tourPackage.service");
const http_status_1 = __importDefault(require("http-status"));
const tourPackage_validation_1 = require("./tourPackage.validation");
//=====================Create Tour Package=====================
const createTourPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse JSON data from form data
    const tourPackageData = JSON.parse(req.body.data);
    // Validate the parsed JSON data
    const validatedData = tourPackage_validation_1.tourPackageDataSchema.parse(tourPackageData);
    // Convert to proper format for service
    const serviceData = Object.assign(Object.assign({}, validatedData), { startDay: validatedData.startDay ? new Date(validatedData.startDay) : undefined, endDay: validatedData.endDay ? new Date(validatedData.endDay) : undefined, photos: validatedData.photos || [] });
    // Get uploaded files
    const files = req.files;
    if (files && files.length > 0) {
        // Create with photos
        const result = yield tourPackage_service_1.TourPackageService.createTourPackageWithPhotos(serviceData, files);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Tour package created successfully with photos',
            data: result,
        });
    }
    else {
        // Create without photos
        const result = yield tourPackage_service_1.TourPackageService.createTourPackage(serviceData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Tour package created successfully',
            data: result,
        });
    }
}));
//=====================Update Tour Package=====================
const updateTourPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Parse JSON data from form data
    const tourPackageData = JSON.parse(req.body.data);
    // Validate the parsed JSON data
    const validatedData = tourPackage_validation_1.tourPackageUpdateDataSchema.parse(tourPackageData);
    // Convert to proper format for service
    const serviceData = Object.assign(Object.assign({}, validatedData), { startDay: validatedData.startDay ? new Date(validatedData.startDay) : undefined, endDay: validatedData.endDay ? new Date(validatedData.endDay) : undefined });
    // Get uploaded files
    const files = req.files;
    if (files && files.length > 0) {
        // Update with photos
        const result = yield tourPackage_service_1.TourPackageService.updateTourPackageWithPhotos(id, serviceData, files);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Tour package updated successfully with photos',
            data: result,
        });
    }
    else {
        // Update without photos
        const result = yield tourPackage_service_1.TourPackageService.updateTourPackage(id, serviceData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Tour package updated successfully',
            data: result,
        });
    }
}));
//=====================Delete Tour Package (Soft Delete)=====================
const deleteTourPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield tourPackage_service_1.TourPackageService.deleteTourPackage(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Tour package deleted successfully',
        data: result,
    });
}));
//=====================Get Tour Package by ID=====================
const getTourPackageById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield tourPackage_service_1.TourPackageService.getTourPackageById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Tour package retrieved successfully',
        data: result,
    });
}));
//=====================Get All Tour Packages=====================
const getAllTourPackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tourPackage_service_1.TourPackageService.getAllTourPackages();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Tour packages retrieved successfully',
        data: result,
    });
}));
//=====================Upload Photos to Tour Package=====================
const uploadPhotos = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'No photos provided',
        });
    }
    const result = yield tourPackage_service_1.TourPackageService.uploadTourPackagePhotos(id, files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Photos uploaded successfully',
        data: { uploadedUrls: result },
    });
}));
//=====================Replace All Photos=====================
const replacePhotos = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'No photos provided',
        });
    }
    const result = yield tourPackage_service_1.TourPackageService.replaceTourPackagePhotos(id, files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Photos replaced successfully',
        data: { uploadedUrls: result },
    });
}));
//=====================Delete Photos=====================
const deletePhotos = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { photoUrls } = req.body;
    if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'No photo URLs provided',
        });
    }
    yield tourPackage_service_1.TourPackageService.deleteTourPackagePhotos(id, photoUrls);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Photos deleted successfully',
    });
}));
exports.TourPackageController = {
    createTourPackage,
    updateTourPackage,
    deleteTourPackage,
    getTourPackageById,
    getAllTourPackages,
    uploadPhotos,
    replacePhotos,
    deletePhotos,
};
