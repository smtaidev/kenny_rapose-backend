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
const payment_routes_1 = require("../modules/payment/payment.routes");
const userActivity_route_1 = require("../modules/UserActivity/userActivity.route");
const tourBooking_route_1 = require("../modules/TourBooking/tourBooking.route");
const admin_route_1 = require("../modules/Admin/admin.route");
const userAssistance_route_1 = require("../modules/UserAssistance/userAssistance.route");
const cancelRequest_route_1 = require("../modules/CancelRequest/cancelRequest.route");
const cart_route_1 = require("../modules/Cart/cart.route");
const subscription_route_1 = require("../modules/Subscription/subscription.route");
const itinerary_routes_1 = require("../modules/itinerary/itinerary.routes");
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
    },
    {
        path: '/payments',
        route: payment_routes_1.paymentRouter,
    },
    {
        path: '/user-activities',
        route: userActivity_route_1.UserActivityRoutes,
    },
    {
        path: '/tour-bookings',
        route: tourBooking_route_1.TourBookingRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/user-assistance',
        route: userAssistance_route_1.UserAssistanceRoutes,
    },
    {
        path: '/cancel-requests',
        route: cancelRequest_route_1.CancelRequestRoutes,
    },
    {
        path: '/cart',
        route: cart_route_1.CartRoutes,
    },
    {
        path: '/subscription',
        route: subscription_route_1.SubscriptionRoutes,
    },
    {
        path: '/itineraries',
        route: itinerary_routes_1.itineraryRouter,
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
