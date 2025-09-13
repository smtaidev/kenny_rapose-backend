-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "externalPaymentId" TEXT,
ADD COLUMN     "paymentMethod" TEXT;
