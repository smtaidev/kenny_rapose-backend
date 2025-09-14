import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

// Load environment variables
dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Exclude webhook route from global body parsing
app.use((req, res, next) => {
  if (req.path === '/api/v1/payments/webhook') {
    // Skip body parsing for webhook route
    next();
  } else {
    // Apply body parsing for all other routes
    express.json()(req, res, next);
  }
});

app.use((req, res, next) => {
  if (req.path === '/api/v1/payments/webhook') {
    // Skip URL encoding for webhook route
    next();
  } else {
    // Apply URL encoding for all other routes
    express.urlencoded({ extended: true })(req, res, next);
  }
});

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({
    Message: "Kenny Rappose Server is running",
  });
});

app.use('/api/v1', router);

// Global error handler - must be last
app.use(globalErrorHandler);

export default app;
