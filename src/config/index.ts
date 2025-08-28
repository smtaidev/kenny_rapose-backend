import dotenv from "dotenv";
import path from "path";
import { Secret } from "jsonwebtoken";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  brevo_user: process.env.BREVO_USER,
  brevo_sender_email: process.env.BREVO_SENDER_EMAIL,
  brevo_api_key: process.env.BREVO_API_KEY,
  base_url_server: process.env.BASE_URL_SERVER,
  base_url_client: process.env.BASE_URL_CLIENT,

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY as string,
  },

  jwt: {
    access_secret: (process.env.JWT_ACCESS_SECRET || 'fallback-secret') as Secret,
    access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN || '1d') as string,
    refresh_secret: (process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret') as Secret,
    refresh_expires_in: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string,
  },
};
