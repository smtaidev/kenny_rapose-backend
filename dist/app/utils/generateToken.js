"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
exports.generateToken = {
    generateAccessToken: (payload) => {
        return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.access_secret, {
            expiresIn: config_1.default.jwt.access_expires_in,
        });
    },
    generateRefreshToken: (payload) => {
        return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.refresh_secret, {
            expiresIn: config_1.default.jwt.refresh_expires_in,
        });
    },
    generatePasswordResetToken: (payload) => {
        return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.access_secret, {
            expiresIn: '1h',
        });
    },
    verifyToken: (token, secret) => {
        return jsonwebtoken_1.default.verify(token, secret);
    },
};
