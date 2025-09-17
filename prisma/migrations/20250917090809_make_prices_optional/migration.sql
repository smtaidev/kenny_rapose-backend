-- AlterTable
ALTER TABLE "public"."tour_packages" ALTER COLUMN "packagePriceAdult" DROP NOT NULL,
ALTER COLUMN "packagePriceChild" DROP NOT NULL,
ALTER COLUMN "packagePriceInfant" DROP NOT NULL,
ALTER COLUMN "packagePriceInfant" DROP DEFAULT;
