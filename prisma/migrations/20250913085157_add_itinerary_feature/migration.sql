-- CreateEnum
CREATE TYPE "public"."ItineraryStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."itineraries" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userFirstName" TEXT NOT NULL,
    "userLastName" TEXT NOT NULL,
    "goingWith" TEXT NOT NULL,
    "total_adults" INTEGER NOT NULL,
    "total_children" INTEGER NOT NULL,
    "destination" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL,
    "amenities" TEXT[],
    "activities" JSONB NOT NULL,
    "pacing" TEXT NOT NULL,
    "food" TEXT[],
    "special_note" TEXT NOT NULL,
    "aiResponse" TEXT,
    "status" "public"."ItineraryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id")
);
