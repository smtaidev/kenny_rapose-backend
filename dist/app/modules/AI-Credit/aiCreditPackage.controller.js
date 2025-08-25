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
exports.AiCreditPackageController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const aiCreditPackage_service_1 = require("./aiCreditPackage.service");
const http_status_1 = __importDefault(require("http-status"));
//=====================Create AI Credit Package=====================
const createAiCreditPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield aiCreditPackage_service_1.AiCreditPackageService.createAiCreditPackage(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'AI Credit Package created successfully',
        data: result,
    });
}));
//=====================Update AI Credit Package=====================
const updateAiCreditPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield aiCreditPackage_service_1.AiCreditPackageService.updateAiCreditPackage(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'AI Credit Package updated successfully',
        data: result,
    });
}));
//=====================Delete AI Credit Package=====================
const deleteAiCreditPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield aiCreditPackage_service_1.AiCreditPackageService.deleteAiCreditPackage(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'AI Credit Package deleted successfully',
        data: result,
    });
}));
//=====================Get AI Credit Package by ID=====================
const getAiCreditPackageById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield aiCreditPackage_service_1.AiCreditPackageService.getAiCreditPackageById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'AI Credit Package retrieved successfully',
        data: result,
    });
}));
//=====================Get All AI Credit Packages=====================
const getAllAiCreditPackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield aiCreditPackage_service_1.AiCreditPackageService.getAllAiCreditPackages();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'AI Credit Packages retrieved successfully',
        data: result,
    });
}));
exports.AiCreditPackageController = {
    createAiCreditPackage,
    updateAiCreditPackage,
    deleteAiCreditPackage,
    getAiCreditPackageById,
    getAllAiCreditPackages,
};
