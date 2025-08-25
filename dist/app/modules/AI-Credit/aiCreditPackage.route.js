"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCreditPackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const aiCreditPackage_controller_1 = require("./aiCreditPackage.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const aiCreditPackage_validation_1 = require("./aiCreditPackage.validation");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
//=====================Get All AI Credit Packages (Public)=====================
router.get('/', aiCreditPackage_controller_1.AiCreditPackageController.getAllAiCreditPackages);
//=====================Get AI Credit Package by ID (Public)=====================
router.get('/:id', aiCreditPackage_controller_1.AiCreditPackageController.getAiCreditPackageById);
//=====================Create AI Credit Package (Admin Only)=====================
router.post('/', auth_1.default, auth_1.requireAdmin, (0, validateRequest_1.default)(aiCreditPackage_validation_1.createAiCreditPackageZodSchema), aiCreditPackage_controller_1.AiCreditPackageController.createAiCreditPackage);
//=====================Update AI Credit Package (Admin Only)=====================
router.patch('/:id', auth_1.default, auth_1.requireAdmin, (0, validateRequest_1.default)(aiCreditPackage_validation_1.updateAiCreditPackageZodSchema), aiCreditPackage_controller_1.AiCreditPackageController.updateAiCreditPackage);
//=====================Delete AI Credit Package (Admin Only)=====================
router.delete('/:id', auth_1.default, auth_1.requireAdmin, aiCreditPackage_controller_1.AiCreditPackageController.deleteAiCreditPackage);
exports.AiCreditPackageRoutes = router;
