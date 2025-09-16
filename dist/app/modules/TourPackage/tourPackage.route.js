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
exports.TourPackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tourPackage_controller_1 = require("./tourPackage.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tourPackage_validation_1 = require("./tourPackage.validation");
const auth_1 = __importStar(require("../../middlewares/auth"));
const upload_1 = __importDefault(require("../../middlewares/upload"));
const router = express_1.default.Router();
//=====================Get All Tour Packages (Public)=====================
router.get('/', tourPackage_controller_1.TourPackageController.getAllTourPackages);
//=====================Get Tour Package by ID (Public)=====================
router.get('/:id', tourPackage_controller_1.TourPackageController.getTourPackageById);
//=====================Create Tour Package (Admin Only)=====================
router.post('/', auth_1.default, auth_1.requireAdmin, upload_1.default.array('photos', 20), // Allow up to 20 photos
(0, validateRequest_1.default)(tourPackage_validation_1.createTourPackageZodSchema), tourPackage_controller_1.TourPackageController.createTourPackage);
//=====================Update Tour Package (Admin Only)=====================
router.patch('/:id', auth_1.default, auth_1.requireAdmin, upload_1.default.array('photos', 20), // Allow up to 20 photos
(0, validateRequest_1.default)(tourPackage_validation_1.updateTourPackageZodSchema), tourPackage_controller_1.TourPackageController.updateTourPackage);
//=====================Delete Tour Package (Admin Only) - Soft Delete=====================
router.delete('/:id', auth_1.default, auth_1.requireAdmin, tourPackage_controller_1.TourPackageController.deleteTourPackage);
//=====================Photo Management Routes (Admin Only)=====================
// Upload additional photos to existing tour package
router.post('/:id/photos', auth_1.default, auth_1.requireAdmin, upload_1.default.array('photos', 20), // Allow up to 20 photos
tourPackage_controller_1.TourPackageController.uploadPhotos);
// Replace all photos of tour package
router.put('/:id/photos', auth_1.default, auth_1.requireAdmin, upload_1.default.array('photos', 20), // Allow up to 20 photos
tourPackage_controller_1.TourPackageController.replacePhotos);
// Delete specific photos from tour package
router.delete('/:id/photos', auth_1.default, auth_1.requireAdmin, (0, validateRequest_1.default)(tourPackage_validation_1.deletePhotosZodSchema), tourPackage_controller_1.TourPackageController.deletePhotos);
exports.TourPackageRoutes = router;
