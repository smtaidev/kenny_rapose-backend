import express, { Router } from "express";
import { AuthRouters } from "../modules/Auth/auth.route";
import { UserRouters } from "../modules/User/user.route";
import { AiCreditPackageRoutes } from "../modules/AI-Credit/aiCreditPackage.route";
import { TourPackageRoutes } from "../modules/TourPackage/tourPackage.route";
import { BreezeWalletRoutes } from "../modules/BreezeWallet/breezeWallet.route";
import { paymentRouter } from "../modules/payment/payment.routes";
import { UserActivityRoutes } from "../modules/UserActivity/userActivity.route";
import { TourBookingRoutes } from "../modules/TourBooking/tourBooking.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { UserAssistanceRoutes } from "../modules/UserAssistance/userAssistance.route";
import { CancelRequestRoutes } from "../modules/CancelRequest/cancelRequest.route";
import { UploadRoutes } from "../modules/Upload/upload.route";
import { CartRoutes } from "../modules/Cart/cart.route";
import { SubscriptionRoutes } from "../modules/Subscription/subscription.route";
import { itineraryRouter } from "../modules/itinerary/itinerary.routes";

const router: Router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRouters,
    },
    {
        path: '/users',
        route: UserRouters,
    },
    {
        path: '/ai-credit-packages',
        route: AiCreditPackageRoutes,
    },
    {
        path: '/tour-packages',
        route: TourPackageRoutes,
    },
    {
        path: '/breeze-wallet',
        route: BreezeWalletRoutes,
    },
    {
        path: '/payments',
        route: paymentRouter,
    },
    {
        path: '/user-activities',
        route: UserActivityRoutes,
    },
    {
        path: '/tour-bookings',
        route: TourBookingRoutes,
    },
    {
        path: '/admin',
        route: AdminRoutes,
    },
    {
        path: '/user-assistance',
        route: UserAssistanceRoutes,
    },
    {
        path: '/cancel-requests',
        route: CancelRequestRoutes,
    },
    {
        path: '/upload',
        route: UploadRoutes,
    },
    {
        path: '/cart',
        route: CartRoutes,
    },
    {
        path: '/subscription',
        route: SubscriptionRoutes,
    },
    {
        path: '/itineraries',
        route: itineraryRouter,
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;