/*
  Warnings:

  - You are about to drop the column `activities` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `amenities` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `departure_date` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `food` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `goingWith` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `pacing` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `return_date` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `special_note` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `total_adults` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `total_children` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `userFirstName` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `userLastName` on the `itineraries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."itineraries" DROP COLUMN "activities",
DROP COLUMN "amenities",
DROP COLUMN "departure_date",
DROP COLUMN "destination",
DROP COLUMN "food",
DROP COLUMN "goingWith",
DROP COLUMN "location",
DROP COLUMN "pacing",
DROP COLUMN "return_date",
DROP COLUMN "special_note",
DROP COLUMN "total_adults",
DROP COLUMN "total_children",
DROP COLUMN "userEmail",
DROP COLUMN "userFirstName",
DROP COLUMN "userLastName";
