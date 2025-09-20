"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://147.93.45.201:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Exclude webhook route from global body parsing
app.use((req, res, next) => {
    if (req.path === '/api/v1/payments/webhook') {
        // Skip body parsing for webhook route
        next();
    }
    else {
        // Apply body parsing for all other routes
        express_1.default.json()(req, res, next);
    }
});
app.use((req, res, next) => {
    if (req.path === '/api/v1/payments/webhook') {
        // Skip URL encoding for webhook route
        next();
    }
    else {
        // Apply URL encoding for all other routes
        express_1.default.urlencoded({ extended: true })(req, res, next);
    }
});
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send({
        Message: "Kenny Rappose Server is running",
    });
});
app.use('/api/v1', routes_1.default);
// Global error handler - must be last
app.use(globalErrorHandler_1.default);
exports.default = app;
