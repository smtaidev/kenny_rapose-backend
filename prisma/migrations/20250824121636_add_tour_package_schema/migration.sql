-- CreateEnum
CREATE TYPE "public"."TourPackageStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- CreateTable
CREATE TABLE "public"."tour_packages" (
    "id" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "totalMembers" INTEGER NOT NULL,
    "pricePerPerson" DOUBLE PRECISION NOT NULL,
    "startDay" TIMESTAMP(3) NOT NULL,
    "endDay" TIMESTAMP(3) NOT NULL,
    "citiesVisited" TEXT[],
    "tourType" TEXT NOT NULL,
    "activities" TEXT[],
    "dailyActivity" JSONB NOT NULL,
    "highlights" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT[],
    "status" "public"."TourPackageStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tour_packages_pkey" PRIMARY KEY ("id")
);
