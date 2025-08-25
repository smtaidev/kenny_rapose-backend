/*
  Warnings:

  - The values [DRAFT] on the enum `TourPackageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TourPackageStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "public"."tour_packages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."tour_packages" ALTER COLUMN "status" TYPE "public"."TourPackageStatus_new" USING ("status"::text::"public"."TourPackageStatus_new");
ALTER TYPE "public"."TourPackageStatus" RENAME TO "TourPackageStatus_old";
ALTER TYPE "public"."TourPackageStatus_new" RENAME TO "TourPackageStatus";
DROP TYPE "public"."TourPackageStatus_old";
ALTER TABLE "public"."tour_packages" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
