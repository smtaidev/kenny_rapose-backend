import express, { Router } from "express";
import { AuthRouters } from "../modules/Auth/auth.route";
import { UserRouters } from "../modules/User/user.route";
import { AiCreditPackageRoutes } from "../modules/AI-Credit/aiCreditPackage.route";
import { TourPackageRoutes } from "../modules/TourPackage/tourPackage.route";

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
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;