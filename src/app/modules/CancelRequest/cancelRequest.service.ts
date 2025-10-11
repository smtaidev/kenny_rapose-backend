import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import {
  ICreateCancelRequest,
  IUpdateCancelRequestStatus,
  ICancelRequestFilters,
} from "../../interface/cancelRequest.interface";

//=====================Create Cancel Request=====================
const createCancelRequest = async (
  userId: string,
  data: ICreateCancelRequest
) => {
  const { tourBookingId } = data;

  // Check if tour booking exists and belongs to user
  const tourBooking = await prisma.tourBooking.findFirst({
    where: {
      id: tourBookingId,
      userId,
      status: "CONFIRMED", // Only confirmed bookings can be cancelled
    },
    include: {
      tourPackage: {
        select: {
          id: true,
          packageName: true,
        },
      },
    },
  });

  if (!tourBooking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Confirmed tour booking not found"
    );
  }

  // Check if cancel request already exists
  const existingCancelRequest = await prisma.cancelRequest.findFirst({
    where: {
      tourBookingId,
      status: "PENDING",
    },
  });

  if (existingCancelRequest) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cancel request already exists for this booking"
    );
  }

  // Create cancel request and update tour booking status
  const result = await prisma.$transaction(async (tx) => {
    // Create cancel request
    const cancelRequest = await tx.cancelRequest.create({
      data: {
        userId,
        tourBookingId,
        status: "PENDING",
      },
    });

    // Update tour booking cancel request status
    await tx.tourBooking.update({
      where: { id: tourBookingId },
      data: { cancelRequestStatus: "PENDING" },
    });

    return cancelRequest;
  });

  return {
    ...result,
    tourBooking: {
      id: tourBooking.id,
      packageName: tourBooking.tourPackage.packageName,
      totalAmount: tourBooking.totalAmount,
      bookingDate: tourBooking.bookingDate,
    },
  };
};

//=====================Get All Cancel Requests (Admin)=====================
const getAllCancelRequests = async (filters: ICancelRequestFilters) => {
  const { status, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const whereClause: any = {};
  if (status) {
    whereClause.status = status;
  }

  const [cancelRequests, totalCount] = await Promise.all([
    prisma.cancelRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true,
            travelerNumber: true,
            phone: true,
            country: true,
          },
        },
        tourBooking: {
          include: {
            tourPackage: {
              select: {
                id: true,
                packageName: true,
                packageCategory: true,
              },
            },
          },
        },
      },
    }),
    prisma.cancelRequest.count({
      where: whereClause,
    }),
  ]);

  return {
    cancelRequests,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

//=====================Update Cancel Request Status (Admin)=====================
const updateCancelRequestStatus = async (
  cancelRequestId: string,
  data: IUpdateCancelRequestStatus
) => {
  const { status } = data;

  // Check if cancel request exists
  const cancelRequest = await prisma.cancelRequest.findUnique({
    where: { id: cancelRequestId },
    include: {
      tourBooking: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!cancelRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Cancel request not found");
  }

  if (cancelRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending cancel requests can be updated"
    );
  }

  // Update cancel request and tour booking status
  const result = await prisma.$transaction(async (tx) => {
    // Update cancel request status
    const updatedCancelRequest = await tx.cancelRequest.update({
      where: { id: cancelRequestId },
      data: { status },
    });

    // Update tour booking cancel request status
    // Note: When status is APPROVED, admin will manually process refund
    // No automatic payment status changes are made
    await tx.tourBooking.update({
      where: { id: cancelRequest.tourBookingId },
      data: { cancelRequestStatus: status },
    });

    return updatedCancelRequest;
  });

  return {
    ...result,
    tourBooking: cancelRequest.tourBooking,
    user: cancelRequest.tourBooking.user,
  };
};

export const CancelRequestService = {
  createCancelRequest,
  getAllCancelRequests,
  updateCancelRequestStatus,
};
