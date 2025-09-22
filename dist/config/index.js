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
    gmail_user: process.env.GMAIL_USER,
    gmail_sender_email: process.env.GMAIL_SENDER_EMAIL,
    gmail_app_password: process.env.GMAIL_APP_PASSWORD,
    base_url_server: process.env.BASE_URL_SERVER,
    base_url_client: process.env.BASE_URL_CLIENT,
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE,
    },
    jwt: {
        access_secret: (process.env.JWT_ACCESS_SECRET ||
            "fallback-secret"),
        access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN || "1d"),
        refresh_secret: (process.env.JWT_REFRESH_SECRET ||
            "fallback-refresh-secret"),
        refresh_expires_in: (process.env.JWT_REFRESH_EXPIRES_IN || "7d"),
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
};
