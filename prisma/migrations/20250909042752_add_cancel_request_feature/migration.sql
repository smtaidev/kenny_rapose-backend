/*
  Warnings:

  - You are about to drop the column `packagePrice` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `tourDuration` on the `tour_packages` table. All the data in the column will be lost.
  - Added the required column `packageCategory` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packagePriceAdult` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packagePriceChild` to the `tour_packages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('AI_CREDIT_PURCHASE', 'WALLET_TOPUP', 'TOUR_BOOKING', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'LOGIN', 'PROFILE_UPDATE');

-- CreateEnum
CREATE TYPE "public"."UserAssistanceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."CancelRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."ai_credit_packages" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."breeze_wallet_packages" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."tour_packages" DROP COLUMN "packagePrice",
DROP COLUMN "tourDuration",
ADD COLUMN     "packageCategory" TEXT NOT NULL,
ADD COLUMN     "packagePriceAdult" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packagePriceChild" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packagePriceInfant" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."breeze_wallet_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "breezeWalletPackageId" TEXT NOT NULL,
    "amountPurchased" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "status" "public"."CreditPurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "breeze_wallet_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tour_bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "tourPackageId" TEXT NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 0,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "cancelRequestStatus" "public"."CancelRequestStatus",
    "bookingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "travelDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "isReadByUser" BOOLEAN NOT NULL DEFAULT false,
    "isReadByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_assistance" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "concern" TEXT NOT NULL,
    "status" "public"."UserAssistanceStatus" NOT NULL DEFAULT 'PENDING',
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_assistance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cancel_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourBookingId" TEXT NOT NULL,
    "status" "public"."CancelRequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cancel_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "breeze_wallet_purchases_paymentId_key" ON "public"."breeze_wallet_purchases"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "tour_bookings_paymentId_key" ON "public"."tour_bookings"("paymentId");

-- AddForeignKey
ALTER TABLE "public"."breeze_wallet_purchases" ADD CONSTRAINT "breeze_wallet_purchases_breezeWalletPackageId_fkey" FOREIGN KEY ("breezeWalletPackageId") REFERENCES "public"."breeze_wallet_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."breeze_wallet_purchases" ADD CONSTRAINT "breeze_wallet_purchases_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."breeze_wallet_purchases" ADD CONSTRAINT "breeze_wallet_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tour_bookings" ADD CONSTRAINT "tour_bookings_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tour_bookings" ADD CONSTRAINT "tour_bookings_tourPackageId_fkey" FOREIGN KEY ("tourPackageId") REFERENCES "public"."tour_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tour_bookings" ADD CONSTRAINT "tour_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cancel_requests" ADD CONSTRAINT "cancel_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cancel_requests" ADD CONSTRAINT "cancel_requests_tourBookingId_fkey" FOREIGN KEY ("tourBookingId") REFERENCES "public"."tour_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
