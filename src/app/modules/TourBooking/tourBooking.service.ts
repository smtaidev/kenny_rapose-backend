import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import {
  ICreateTourBooking,
  IUpdateTourBooking,
} from "../../interface/tourBooking.interface";

//=====================Get User Tour Bookings=====================
const getUserTourBookings = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [bookings, totalCount] = await Promise.all([
    prisma.tourBooking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        tourPackage: true,
        cancelRequests: {
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.tourBooking.count({
      where: { userId },
    }),
  ]);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

//=====================Get Tour Booking by ID=====================
const getTourBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.tourBooking.findFirst({
    where: { id: bookingId, userId },
    include: {
      tourPackage: {
        select: {
          id: true,
          packageName: true,
          packageCategory: true,
          packagePriceAdult: true,
          packagePriceChild: true,
          packagePriceInfant: true,
        },
      },
      cancelRequests: {
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour booking not found");
  }

  return booking;
};

//=====================Cancel Tour Booking=====================
const cancelTourBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.tourBooking.findFirst({
    where: { id: bookingId, userId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour booking not found");
  }

  if (booking.status === "CANCELLED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking is already cancelled");
  }

  const updatedBooking = await prisma.tourBooking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: {
      tourPackage: {
        select: {
          id: true,
          packageName: true,
          packageCategory: true,
        },
      },
    },
  });

  return updatedBooking;
};

//=====================Calculate Cashback for Tour Package=====================
const calculateCashback = async (
  tourPackageId: string,
  totalAmount: number
) => {
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { id: tourPackageId },
    select: { breezeCredit: true, packageName: true },
  });

  if (!tourPackage) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour package not found");
  }

  const cashbackAmount =
    tourPackage.breezeCredit > 0
      ? (totalAmount * tourPackage.breezeCredit) / 100
      : 0;

  return {
    cashbackPercentage: tourPackage.breezeCredit,
    cashbackAmount,
    packageName: tourPackage.packageName,
  };
};

export const TourBookingService = {
  getUserTourBookings,
  getTourBookingById,
  cancelTourBooking,
  calculateCashback,
};
