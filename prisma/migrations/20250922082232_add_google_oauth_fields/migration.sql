/*
  Warnings:

  - You are about to drop the column `activities` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `citiesVisited` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `highlights` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerPerson` on the `tour_packages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."tour_packages" DROP COLUMN "activities",
DROP COLUMN "citiesVisited",
DROP COLUMN "description",
DROP COLUMN "highlights",
DROP COLUMN "pricePerPerson",
ADD COLUMN     "dropOff" TEXT,
ADD COLUMN     "pickUp" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "public"."users"("googleId");
