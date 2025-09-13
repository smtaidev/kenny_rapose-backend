/*
  Warnings:

  - The `pacing` column on the `itineraries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."itineraries" DROP COLUMN "pacing",
ADD COLUMN     "pacing" TEXT[];
