/*
  Warnings:

  - You are about to drop the column `canChangePassword` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "canChangePassword",
ADD COLUMN     "country" TEXT;
