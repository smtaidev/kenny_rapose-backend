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
//=====================Create Tour Package=====================
const createTourPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tourPackage_service_1.TourPackageService.createTourPackage(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Tour package created successfully',
        data: result,
    });
}));
//=====================Update Tour Package=====================
const updateTourPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield tourPackage_service_1.TourPackageService.updateTourPackage(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Tour package updated successfully',
        data: result,
    });
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
exports.TourPackageController = {
    createTourPackage,
    updateTourPackage,
    deleteTourPackage,
    getTourPackageById,
    getAllTourPackages,
};
