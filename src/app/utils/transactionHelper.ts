import prisma from './prisma';

/**
 * Utility functions for common transaction patterns
 */

/**
 * Execute multiple operations in a single transaction
 * @param operations - Array of operations to execute
 * @returns Promise with the results
 */
export const executeInTransaction = async <T>(
  operations: Array<(tx: any) => Promise<T>>
): Promise<T[]> => {
  return await prisma.$transaction(async (tx) => {
    const results: T[] = [];
    for (const operation of operations) {
      const result = await operation(tx);
      results.push(result);
    }
    return results;
  });
};

/**
 * Execute a single operation in a transaction
 * @param operation - Operation to execute
 * @returns Promise with the result
 */
export const executeSingleInTransaction = async <T>(
  operation: (tx: any) => Promise<T>
): Promise<T> => {
  return await prisma.$transaction(async (tx) => {
    return await operation(tx);
  });
};

/**
 * Execute operations with rollback on error
 * @param operations - Array of operations to execute
 * @param onError - Error handler function
 * @returns Promise with the results or error
 */
export const executeWithRollback = async <T>(
  operations: Array<(tx: any) => Promise<T>>,
  onError?: (error: any) => void
): Promise<T[]> => {
  try {
    return await executeInTransaction(operations);
  } catch (error) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
};

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
