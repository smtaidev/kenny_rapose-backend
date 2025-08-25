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
exports.executeWithRollback = exports.executeSingleInTransaction = exports.executeInTransaction = void 0;
const prisma_1 = __importDefault(require("./prisma"));
/**
 * Utility functions for common transaction patterns
 */
/**
 * Execute multiple operations in a single transaction
 * @param operations - Array of operations to execute
 * @returns Promise with the results
 */
const executeInTransaction = (operations) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const results = [];
        for (const operation of operations) {
            const result = yield operation(tx);
            results.push(result);
        }
        return results;
    }));
});
exports.executeInTransaction = executeInTransaction;
/**
 * Execute a single operation in a transaction
 * @param operation - Operation to execute
 * @returns Promise with the result
 */
const executeSingleInTransaction = (operation) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield operation(tx);
    }));
});
exports.executeSingleInTransaction = executeSingleInTransaction;
/**
 * Execute operations with rollback on error
 * @param operations - Array of operations to execute
 * @param onError - Error handler function
 * @returns Promise with the results or error
 */
const executeWithRollback = (operations, onError) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, exports.executeInTransaction)(operations);
    }
    catch (error) {
        if (onError) {
            onError(error);
        }
        throw error;
    }
});
exports.executeWithRollback = executeWithRollback;
/**
 * Example usage patterns:
 *
 * // Multiple operations
 * const results = await executeInTransaction([
 *   (tx) => tx.user.create({ data: userData }),
 *   (tx) => tx.profile.create({ data: profileData }),
 *   (tx) => tx.log.create({ data: logData })
 * ]);
 *
 * // Single operation
 * const user = await executeSingleInTransaction(
 *   (tx) => tx.user.create({ data: userData })
 * );
 *
 * // With error handling
 * const results = await executeWithRollback([
 *   (tx) => tx.user.update({ where: { id }, data: updateData }),
 *   (tx) => tx.audit.create({ data: auditData })
 * ], (error) => {
 *   console.error('Transaction failed:', error);
 * });
 */
