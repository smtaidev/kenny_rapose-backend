import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICreateTourBooking, IUpdateTourBooking } from '../../interface/tourBooking.interface';

//=====================Create Tour Booking (For Payment Integration)=====================
const createTourBooking = async (bookingData: ICreateTourBooking, userId: string, paymentId: string) => {
  // Get tour package details
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { id: bookingData.tourPackageId },
  });

  if (!tourPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
  }

  // Calculate total amount
  const totalAmount = 
    (bookingData.adults * tourPackage.packagePriceAdult) +
    (bookingData.children * tourPackage.packagePriceChild) +
    (bookingData.infants * tourPackage.packagePriceInfant);

  const newBooking = await prisma.tourBooking.create({
    data: {
      userId,
      paymentId,
      tourPackageId: bookingData.tourPackageId,
      adults: bookingData.adults,
      children: bookingData.children,
      infants: bookingData.infants,
      totalAmount,
      travelDate: bookingData.travelDate,
    },
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
    },
  });

  return newBooking;
};

//=====================Get User Tour Bookings=====================
const getUserTourBookings = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [bookings, totalCount] = await Promise.all([
    prisma.tourBooking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
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
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour booking not found');
  }

  return booking;
};

//=====================Update Tour Booking=====================
const updateTourBooking = async (bookingId: string, updateData: IUpdateTourBooking, userId: string) => {
  const booking = await prisma.tourBooking.findFirst({
    where: { id: bookingId, userId },
    include: { tourPackage: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour booking not found');
  }

  // Recalculate total amount if passenger counts changed
  let totalAmount = booking.totalAmount;
  if (updateData.adults !== undefined || updateData.children !== undefined || updateData.infants !== undefined) {
    const adults = updateData.adults ?? booking.adults;
    const children = updateData.children ?? booking.children;
    const infants = updateData.infants ?? booking.infants;
    
    totalAmount = 
      (adults * booking.tourPackage.packagePriceAdult) +
      (children * booking.tourPackage.packagePriceChild) +
      (infants * booking.tourPackage.packagePriceInfant);
  }

  const updatedBooking = await prisma.tourBooking.update({
    where: { id: bookingId },
    data: {
      ...updateData,
      totalAmount,
    },
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
    },
  });

  return updatedBooking;
};

//=====================Cancel Tour Booking=====================
const cancelTourBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.tourBooking.findFirst({
    where: { id: bookingId, userId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour booking not found');
  }

  if (booking.status === 'CANCELLED') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking is already cancelled');
  }

  const updatedBooking = await prisma.tourBooking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
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
const calculateCashback = async (tourPackageId: string, totalAmount: number) => {
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { id: tourPackageId },
    select: { breezeCredit: true, packageName: true },
  });

  if (!tourPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
  }

  const cashbackAmount = tourPackage.breezeCredit > 0 
    ? (totalAmount * tourPackage.breezeCredit) / 100 
    : 0;

  return {
    cashbackPercentage: tourPackage.breezeCredit,
    cashbackAmount,
    packageName: tourPackage.packageName,
  };
};

export const TourBookingService = {
  createTourBooking,
  getUserTourBookings,
  getTourBookingById,
  updateTourBooking,
  cancelTourBooking,
  calculateCashback,
};
