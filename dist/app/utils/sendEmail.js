"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config_1.default.gmail_user,
        pass: config_1.default.gmail_app_password,
    },
});
function sendOtpEmail(to, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield transporter.sendMail({
                from: config_1.default.gmail_sender_email,
                to,
                subject: "Your OTP Code",
                text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
                html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p><strong>This code will expire in 5 minutes.</strong></p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>`,
            });
        }
        catch (error) {
            console.error("Email sending failed:", error);
            throw new Error("Failed to send OTP email");
        }
    });
}
