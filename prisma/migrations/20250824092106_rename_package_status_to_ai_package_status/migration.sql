/*
  Warnings:

  - The `status` column on the `ai_credit_packages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."AIPackageStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "public"."ai_credit_packages" DROP COLUMN "status",
ADD COLUMN     "status" "public"."AIPackageStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "public"."PackageStatus";
