import httpStatus from "http-status";
import prisma from "../../utils/prisma";
import {
  ICreateItinerary,
  IItineraryResponse,
  IAIRequest,
  IUpdateActivityRequest,
  IAddActivityRequest,
  IActivity,
  IDay,
} from "../../interface/itinerary.interface";
import { callAIEndpoint } from "../../lib/aiService";
import AppError from "../../errors/AppError";
import { v4 as uuidv4 } from "uuid";

const createItinerary = async (
  payload: ICreateItinerary,
  userId: string
): Promise<IItineraryResponse> => {
  try {
    // Prepare user info for storage
    const userInfo = {
      total_adults: payload.total_adults,
      total_children: payload.total_children,
      destination: payload.destination,
      location: payload.location,
      departure_date: payload.departure_date,
      return_date: payload.return_date,
      amenities: payload.amenities,
      activities: payload.activities,
      pacing: payload.pacing,
      food: payload.food,
      special_note: payload.special_note,
    };

    // Create itinerary record with PENDING status
    const itinerary = await prisma.itinerary.create({
      data: {
        userId: userId,
        status: "PENDING",
        userInfo: userInfo,
      },
    });

    // Prepare data for AI endpoint
    const aiRequest: IAIRequest = {
      total_adults: payload.total_adults,
      total_children: payload.total_children,
      destination: payload.destination,
      location: payload.location,
      departure_date: payload.departure_date,
      return_date: payload.return_date,
      amenities: payload.amenities,
      activities: payload.activities,
      pacing: payload.pacing,
      food: payload.food,
      special_note: payload.special_note,
    };

    // Call AI endpoint
    const aiResponse = await callAIEndpoint(aiRequest);

    if (!aiResponse.success) {
      // Update itinerary with FAILED status
      const failedItinerary = await prisma.itinerary.update({
        where: { id: itinerary.id },
        data: {
          status: "FAILED",
        },
      });

      return {
        id: failedItinerary.id,
        itinerary_id: "",
        days: [],
        status: "FAILED",
        userInfo: userInfo,
        createdAt: failedItinerary.createdAt,
        updatedAt: failedItinerary.updatedAt,
      };
    }

    // Process AI response data
    const aiData = aiResponse.data;
    const processedDays = aiData.days.map((day: IDay) => ({
      ...day,
      activities: day.activities.map((activity: any) => ({
        ...activity,
        id: activity.id || uuidv4(),
      })),
    }));

    // Update itinerary with AI response
    const updatedItinerary = await prisma.itinerary.update({
      where: { id: itinerary.id },
      data: {
        aiResponse: {
          itinerary_id: aiData.itinerary_id,
          days: processedDays,
          status: aiData.status,
        },
        status: "COMPLETED",
      },
    });

    return {
      id: updatedItinerary.id,
      itinerary_id: aiData.itinerary_id,
      days: processedDays,
      status: "COMPLETED",
      userInfo: userInfo,
      createdAt: updatedItinerary.createdAt,
      updatedAt: updatedItinerary.updatedAt,
    };
  } catch (error: any) {
    console.error("Itinerary creation error:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create itinerary. Please try again."
    );
  }
};

const getItineraryById = async (
  id: string,
  userId: string
): Promise<IItineraryResponse> => {
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!itinerary) {
    throw new AppError(httpStatus.NOT_FOUND, "Itinerary not found");
  }

  const aiResponse = itinerary.aiResponse as any;
  const userInfo = itinerary.userInfo as any;

  return {
    id: itinerary.id,
    itinerary_id: aiResponse?.itinerary_id || "",
    days: aiResponse?.days || [],
    status: itinerary.status as "PENDING" | "COMPLETED" | "FAILED",
    userInfo: userInfo || {},
    createdAt: itinerary.createdAt,
    updatedAt: itinerary.updatedAt,
  };
};

const getAllItineraries = async (
  userId: string
): Promise<IItineraryResponse[]> => {
  const itineraries = await prisma.itinerary.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  return itineraries.map((itinerary) => {
    const aiResponse = itinerary.aiResponse as any;
    const userInfo = itinerary.userInfo as any;

    return {
      id: itinerary.id,
      itinerary_id: aiResponse?.itinerary_id || "",
      days: aiResponse?.days || [],
      status: itinerary.status as "PENDING" | "COMPLETED" | "FAILED",
      userInfo: userInfo || {},
      createdAt: itinerary.createdAt,
      updatedAt: itinerary.updatedAt,
    };
  });
};

const updateActivity = async (
  payload: IUpdateActivityRequest,
  userId: string
) => {
  try {
    const { itinerary_id, activity_id, day_uuid, activity } = payload;

    // Find the itinerary
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itinerary_id,
        userId: userId,
      },
    });

    if (!itinerary) {
      throw new AppError(httpStatus.NOT_FOUND, "Itinerary not found");
    }

    if (itinerary.status !== "COMPLETED") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Can only update activities in completed itineraries"
      );
    }

    // Parse the current AI response
    const currentAiResponse = itinerary.aiResponse as any;
    if (!currentAiResponse || !currentAiResponse.days) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid itinerary data");
    }

    // Find the specific day
    const dayIndex = currentAiResponse.days.findIndex(
      (day: any) => day.day_uuid === day_uuid
    );
    if (dayIndex === -1) {
      throw new AppError(httpStatus.NOT_FOUND, "Day not found in itinerary");
    }

    // Find the specific activity
    const activityIndex = currentAiResponse.days[dayIndex].activities.findIndex(
      (act: IActivity) => act.id === activity_id
    );
    if (activityIndex === -1) {
      throw new AppError(httpStatus.NOT_FOUND, "Activity not found in day");
    }

    // Update the activity
    const updatedAiResponse = { ...currentAiResponse };
    updatedAiResponse.days[dayIndex].activities[activityIndex] = {
      id: activity_id,
      time: activity.time,
      title: activity.title,
      description: activity.description,
      place: activity.place,
      keyword: activity.keyword,
    };

    // Update the itinerary in database
    const updatedItinerary = await prisma.itinerary.update({
      where: { id: itinerary_id },
      data: {
        aiResponse: updatedAiResponse as any,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Activity updated successfully",
      data: {
        id: updatedItinerary.id,
        aiResponse: updatedItinerary.aiResponse as any,
        status: updatedItinerary.status as "PENDING" | "COMPLETED" | "FAILED",
        createdAt: updatedItinerary.createdAt,
        updatedAt: updatedItinerary.updatedAt,
      },
    };
  } catch (error: any) {
    console.error("Update activity error:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update activity. Please try again."
    );
  }
};

const addActivity = async (
  payload: IAddActivityRequest,
  userId: string
): Promise<IItineraryResponse> => {
  try {
    const { itinerary_id, day_uuid, activity } = payload;

    // Find the itinerary
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itinerary_id,
        userId: userId,
      },
    });

    if (!itinerary) {
      throw new AppError(httpStatus.NOT_FOUND, "Itinerary not found");
    }

    if (itinerary.status !== "COMPLETED") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Can only add activities to completed itineraries"
      );
    }

    // Parse the current AI response
    const currentAiResponse = itinerary.aiResponse as any;
    if (!currentAiResponse || !currentAiResponse.days) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid itinerary data");
    }

    // Find the specific day
    const dayIndex = currentAiResponse.days.findIndex(
      (day: any) => day.day_uuid === day_uuid
    );
    if (dayIndex === -1) {
      throw new AppError(httpStatus.NOT_FOUND, "Day not found in itinerary");
    }

    // Create new activity with unique ID
    const newActivity: IActivity = {
      id: uuidv4(),
      time: activity.time,
      title: activity.title,
      description: activity.description,
      place: activity.place,
      keyword: activity.keyword,
    };

    // Add the new activity to the day
    currentAiResponse.days[dayIndex].activities.push(newActivity);

    // Sort activities by time (optional - you might want to keep user's order)
    currentAiResponse.days[dayIndex].activities.sort(
      (a: IActivity, b: IActivity) => {
        const timeA = new Date(`2000-01-01 ${a.time}`);
        const timeB = new Date(`2000-01-01 ${b.time}`);
        return timeA.getTime() - timeB.getTime();
      }
    );

    // Update the itinerary in database
    const updatedItinerary = await prisma.itinerary.update({
      where: { id: itinerary_id },
      data: {
        aiResponse: currentAiResponse,
      },
    });

    // Return the updated itinerary
    return {
      id: updatedItinerary.id,
      itinerary_id: currentAiResponse.itinerary_id,
      days: currentAiResponse.days,
      status: updatedItinerary.status as "PENDING" | "COMPLETED" | "FAILED",
      userInfo: itinerary.userInfo as any,
      createdAt: updatedItinerary.createdAt,
      updatedAt: updatedItinerary.updatedAt,
    };
  } catch (error: any) {
    console.error("Add activity error:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to add activity. Please try again."
    );
  }
};

export const ItineraryService = {
  createItinerary,
  getItineraryById,
  getAllItineraries,
  updateActivity,
  addActivity,
};
