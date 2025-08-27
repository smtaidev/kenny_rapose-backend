-- CreateEnum
CREATE TYPE "public"."BreezeWalletPackageStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "breezeWalletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."breeze_wallet_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "public"."BreezeWalletPackageStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "breeze_wallet_packages_pkey" PRIMARY KEY ("id")
);
