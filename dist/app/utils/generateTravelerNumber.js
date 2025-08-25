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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueTravelerNumber = exports.generateTravelerNumber = void 0;
const generateTravelerNumber = () => {
    // Generate random letters (A-Z)
    const generateLetter = () => {
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    };
    // Generate random digits (0-9)
    const generateDigit = () => {
        return Math.floor(Math.random() * 10).toString();
    };
    // Generate 8 characters with random mix of letters and numbers
    let travelerNumber = '';
    for (let i = 0; i < 8; i++) {
        // 50% chance for letter, 50% chance for digit
        if (Math.random() < 0.5) {
            travelerNumber += generateLetter();
        }
        else {
            travelerNumber += generateDigit();
        }
    }
    return travelerNumber;
};
exports.generateTravelerNumber = generateTravelerNumber;
/**
 * Generates a unique traveler number and ensures it's unique in the database
 * This function should be called during user registration
 */
const generateUniqueTravelerNumber = (prisma) => __awaiter(void 0, void 0, void 0, function* () {
    let travelerNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    while (!isUnique && attempts < maxAttempts) {
        travelerNumber = (0, exports.generateTravelerNumber)();
        // Check if this traveler number already exists
        const existingUser = yield prisma.user.findUnique({
            where: { travelerNumber }
        });
        if (!existingUser) {
            isUnique = true;
        }
        else {
            attempts++;
        }
    }
    if (!isUnique) {
        throw new Error('Unable to generate unique traveler number after multiple attempts');
    }
    return travelerNumber;
});
exports.generateUniqueTravelerNumber = generateUniqueTravelerNumber;
