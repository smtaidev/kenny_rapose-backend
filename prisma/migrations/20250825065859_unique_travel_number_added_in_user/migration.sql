/*
  Warnings:

  - A unique constraint covering the columns `[travelerNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `travelerNumber` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "travelerNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_travelerNumber_key" ON "public"."users"("travelerNumber");
