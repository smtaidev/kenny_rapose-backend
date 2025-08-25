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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
