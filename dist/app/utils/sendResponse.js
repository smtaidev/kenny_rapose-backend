"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: (data === null || data === void 0 ? void 0 : data.success) || (data === null || data === void 0 ? void 0 : data.statusCode) < 400 ? true : false,
        statusCode: data === null || data === void 0 ? void 0 : data.statusCode,
        message: data.message,
        meta: data.meta,
        data: (data === null || data === void 0 ? void 0 : data.data) || null || undefined,
    });
};
exports.default = sendResponse;
