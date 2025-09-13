/*
  Warnings:

  - The `aiResponse` column on the `itineraries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."itineraries" DROP COLUMN "aiResponse",
ADD COLUMN     "aiResponse" JSONB;
