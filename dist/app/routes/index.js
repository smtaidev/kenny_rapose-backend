"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const aiCreditPackage_route_1 = require("../modules/AI-Credit/aiCreditPackage.route");
const tourPackage_route_1 = require("../modules/TourPackage/tourPackage.route");
const breezeWallet_route_1 = require("../modules/BreezeWallet/breezeWallet.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRouters,
    },
    {
        path: '/users',
        route: user_route_1.UserRouters,
    },
    {
        path: '/ai-credit-packages',
        route: aiCreditPackage_route_1.AiCreditPackageRoutes,
    },
    {
        path: '/tour-packages',
        route: tourPackage_route_1.TourPackageRoutes,
    },
    {
        path: '/breeze-wallet',
        route: breezeWallet_route_1.BreezeWalletRoutes,
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
