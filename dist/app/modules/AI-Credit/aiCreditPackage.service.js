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
exports.AiCreditPackageService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
//=====================Create AI Credit Package=====================
const createAiCreditPackage = (packageData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if package with same name already exists
    const existingPackage = yield prisma_1.default.aiCreditPackage.findFirst({
        where: {
            name: packageData.name,
            isDeleted: false,
        },
    });
    if (existingPackage) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Package with this name already exists");
    }
    // Create new package
    const newPackage = yield prisma_1.default.aiCreditPackage.create({
        data: packageData,
        select: {
            id: true,
            name: true,
            credits: true,
            price: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return newPackage;
});
//=====================Update AI Credit Package=====================
const updateAiCreditPackage = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if package exists
    const existingPackage = yield prisma_1.default.aiCreditPackage.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!existingPackage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "AI Credit Package not found");
    }
    // If name is being updated, check for duplicates
    if (updateData.name && updateData.name !== existingPackage.name) {
        const duplicatePackage = yield prisma_1.default.aiCreditPackage.findFirst({
            where: {
                name: updateData.name,
                id: { not: id },
                isDeleted: false,
            },
        });
        if (duplicatePackage) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Package with this name already exists");
        }
    }
    // Update package
    const updatedPackage = yield prisma_1.default.aiCreditPackage.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            credits: true,
            price: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedPackage;
});
//=====================Delete AI Credit Package=====================
const deleteAiCreditPackage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if package exists
    const existingPackage = yield prisma_1.default.aiCreditPackage.findUnique({
        where: { id },
    });
    if (!existingPackage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "AI Credit Package not found");
    }
    // Soft delete the package
    yield prisma_1.default.aiCreditPackage.update({
        where: { id },
        data: {
            status: "INACTIVE",
            isDeleted: true,
        },
    });
    return { message: "AI Credit Package deleted successfully" };
});
//=====================Get AI Credit Package by ID=====================
const getAiCreditPackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const creditPackage = yield prisma_1.default.aiCreditPackage.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            credits: true,
            price: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!creditPackage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "AI Credit Package not found");
    }
    return creditPackage;
});
//=====================Get All AI Credit Packages=====================
const getAllAiCreditPackages = () => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield prisma_1.default.aiCreditPackage.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            credits: true,
            price: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return packages;
});
//=====================Get Simple Credit Purchase History=====================
const getSimpleCreditPurchaseHistory = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [purchases, totalCount] = yield Promise.all([
        prisma_1.default.creditPurchase.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                creditsPurchased: true,
                amountPaid: true,
                createdAt: true,
            },
        }),
        prisma_1.default.creditPurchase.count({ where: { userId } }),
    ]);
    // Simple formatting
    const history = purchases.map((purchase) => ({
        credit: purchase.creditsPurchased,
        amount: purchase.amountPaid,
        buyingDate: purchase.createdAt,
    }));
    return {
        history,
        pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    };
});
exports.AiCreditPackageService = {
    createAiCreditPackage,
    updateAiCreditPackage,
    deleteAiCreditPackage,
    getAiCreditPackageById,
    getAllAiCreditPackages,
    getSimpleCreditPurchaseHistory,
};
