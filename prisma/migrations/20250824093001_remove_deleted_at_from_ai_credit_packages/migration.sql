/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `ai_credit_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ai_credit_packages" DROP COLUMN "deletedAt";
