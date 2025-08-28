"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    brevo_user: process.env.BREVO_USER,
    brevo_sender_email: process.env.BREVO_SENDER_EMAIL,
    brevo_api_key: process.env.BREVO_API_KEY,
    base_url_server: process.env.BASE_URL_SERVER,
    base_url_client: process.env.BASE_URL_CLIENT,
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    jwt: {
        access_secret: (process.env.JWT_ACCESS_SECRET || 'fallback-secret'),
        access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN || '1d'),
        refresh_secret: (process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'),
        refresh_expires_in: (process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    },
};
