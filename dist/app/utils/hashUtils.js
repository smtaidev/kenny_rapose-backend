"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashUserId = void 0;
// Function to hash user IDs to shorter strings
const hashUserId = (userId) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
};
exports.hashUserId = hashUserId;
