import { Response } from "express";
import { ItineraryService } from "./itinerary.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth";
import {
  IUpdateActivityRequest,
  IAddActivityRequest,
  IDeleteActivityRequest,
  IDeleteItineraryRequest,
} from "../../interface/itinerary.interface";

const createItinerary = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const result = await ItineraryService.createItinerary(payload, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Itinerary created successfully",
    data: result,
  });
});

const getItineraryById = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const result = await ItineraryService.getItineraryById(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Itinerary retrieved successfully",
    data: result,
  });
});

const getAllItineraries = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "User not authenticated",
        data: null,
      });
    }

    const result = await ItineraryService.getAllItineraries(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Itineraries retrieved successfully",
      data: result,
    });
  }
);

const updateActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload: IUpdateActivityRequest = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const result = await ItineraryService.updateActivity(payload, userId);

  sendResponse(res, {
    statusCode: 200,
    success: result.success,
    message: result.message || "Activity updated successfully",
    data: result.data,
  });
});

const addActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload: IAddActivityRequest = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const result = await ItineraryService.addActivity(payload, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Activity added successfully",
    data: result,
  });
});

const deleteActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload: IDeleteActivityRequest = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const result = await ItineraryService.deleteActivity(payload, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Activity deleted successfully",
    data: result,
  });
});

const deleteItinerary = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload: IDeleteItineraryRequest = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const result = await ItineraryService.deleteItinerary(payload, userId);

  sendResponse(res, {
    statusCode: 200,
    success: result.success,
    message: result.message,
    data: null,
  });
});

export const ItineraryController = {
  createItinerary,
  getItineraryById,
  getAllItineraries,
  updateActivity,
  addActivity,
  deleteActivity,
  deleteItinerary,
};
