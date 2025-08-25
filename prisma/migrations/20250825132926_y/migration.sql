/*
  Warnings:

  - Added the required column `about` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageRangeFrom` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageRangeTo` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `breezeCredit` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `help` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packagePrice` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `star` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tourDuration` to the `tour_packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tour_packages" ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "additionalInfo" TEXT[],
ADD COLUMN     "ageRangeFrom" INTEGER NOT NULL,
ADD COLUMN     "ageRangeTo" INTEGER NOT NULL,
ADD COLUMN     "breezeCredit" INTEGER NOT NULL,
ADD COLUMN     "cancellationPolicy" TEXT[],
ADD COLUMN     "help" TEXT NOT NULL,
ADD COLUMN     "packagePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "star" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tourDuration" INTEGER NOT NULL,
ADD COLUMN     "whatIncluded" TEXT[],
ADD COLUMN     "whatNotIncluded" TEXT[],
ALTER COLUMN "totalMembers" DROP NOT NULL,
ALTER COLUMN "pricePerPerson" DROP NOT NULL,
ALTER COLUMN "startDay" DROP NOT NULL,
ALTER COLUMN "endDay" DROP NOT NULL,
ALTER COLUMN "tourType" DROP NOT NULL,
ALTER COLUMN "dailyActivity" DROP NOT NULL,
ALTER COLUMN "highlights" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
