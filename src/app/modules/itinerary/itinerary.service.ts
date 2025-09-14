import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { 
  ICreateItinerary, 
  IItineraryResponse, 
  IAIRequest, 
  IEditActivityRequest, 
  IEditAIRequest, 
  IUpdateActivityRequest,
  IActivity,
  IDay
} from '../../interface/itinerary.interface';
import { callAIEndpoint, callAIEditEndpoint } from '../../lib/aiService';
import AppError from '../../errors/AppError';
import { v4 as uuidv4 } from 'uuid';

const createItinerary = async (payload: ICreateItinerary): Promise<IItineraryResponse> => {
  try {
    // Prepare user info for storage
    const userInfo = {
      userEmail: payload.userEmail,
      userFirstName: payload.userFirstName,
      userLastName: payload.userLastName,
      goingWith: payload.goingWith,
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
    const itinerary = await prisma.Itinerary.create({
      data: {
        status: 'PENDING',
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

    // Add unique IDs to activities if AI response is successful
    let processedAiResponse = aiResponse.data;
    if (aiResponse.success && processedAiResponse.days) {
      processedAiResponse = {
        ...processedAiResponse,
        itinerary_id: itinerary.id,
        days: processedAiResponse.days.map((day: IDay) => ({
          ...day,
          activities: day.activities.map((activity: any) => ({
            ...activity,
            id: activity.id || uuidv4(),
          })),
        })),
      };
    }

    // Update itinerary with AI response
    const updatedItinerary = await prisma.Itinerary.update({
      where: { id: itinerary.id },
      data: {
        aiResponse: processedAiResponse as any,
        status: aiResponse.success ? 'COMPLETED' : 'FAILED',
      },
    });

    return {
      id: updatedItinerary.id,
      aiResponse: updatedItinerary.aiResponse as any,
      status: updatedItinerary.status as 'PENDING' | 'COMPLETED' | 'FAILED',
      createdAt: updatedItinerary.createdAt,
      updatedAt: updatedItinerary.updatedAt,
    };
  } catch (error: any) {
    console.error('Itinerary creation error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create itinerary. Please try again.'
    );
  }
};

const getItineraryById = async (id: string): Promise<IItineraryResponse> => {
  const itinerary = await prisma.Itinerary.findUnique({
    where: { id },
  });

  if (!itinerary) {
    throw new AppError(httpStatus.NOT_FOUND, 'Itinerary not found');
  }

  return {
    id: itinerary.id,
    aiResponse: itinerary.aiResponse as any,
    status: itinerary.status as 'PENDING' | 'COMPLETED' | 'FAILED',
    createdAt: itinerary.createdAt,
    updatedAt: itinerary.updatedAt,
  };
};

const getAllItineraries = async (): Promise<IItineraryResponse[]> => {
  const itineraries = await prisma.Itinerary.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return itineraries.map(itinerary => ({
    id: itinerary.id,
    aiResponse: itinerary.aiResponse as any,
    status: itinerary.status as 'PENDING' | 'COMPLETED' | 'FAILED',
    createdAt: itinerary.createdAt,
    updatedAt: itinerary.updatedAt,
  }));
};

const editActivity = async (payload: IEditActivityRequest) => {
  try {
    // Get itinerary from database
    const itinerary = await prisma.Itinerary.findUnique({
      where: { id: payload.itinerary_id },
    });

    if (!itinerary) {
      throw new AppError(httpStatus.NOT_FOUND, 'Itinerary not found');
    }

    if (!itinerary.aiResponse || !itinerary.userInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Itinerary data is incomplete');
    }

    const aiResponse = itinerary.aiResponse as any;
    const userInfo = itinerary.userInfo as any;

    // Find the current activity
    let currentActivity: IActivity | null = null;
    let dayPlan: IActivity[] = [];

    for (const day of aiResponse.days) {
      const activity = day.activities.find((act: IActivity) => act.id === payload.activity_id);
      if (activity) {
        currentActivity = activity;
        dayPlan = day.activities;
        break;
      }
    }

    if (!currentActivity) {
      throw new AppError(httpStatus.NOT_FOUND, 'Activity not found');
    }

    // Prepare edit request for AI
    const editRequest: IEditAIRequest = {
      current_activity: currentActivity,
      user_change: payload.user_change,
      day_plan: dayPlan,
      user_info: {
        total_adults: userInfo.total_adults,
        total_children: userInfo.total_children,
        destination: userInfo.destination,
        location: userInfo.location,
        departure_date: userInfo.departure_date,
        return_date: userInfo.return_date,
        amenities: userInfo.amenities,
        activities: userInfo.activities,
        pacing: userInfo.pacing,
        food: userInfo.food,
        special_note: userInfo.special_note,
      },
    };

    // Call AI edit endpoint
    const aiEditResponse = await callAIEditEndpoint(editRequest);

    return {
      success: aiEditResponse.success,
      data: aiEditResponse.data,
      message: aiEditResponse.message,
    };
  } catch (error: any) {
    console.error('Edit activity error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to edit activity. Please try again.'
    );
  }
};

const updateActivity = async (payload: IUpdateActivityRequest) => {
  try {
    // Get itinerary from database
    const itinerary = await prisma.Itinerary.findUnique({
      where: { id: payload.itinerary_id },
    });

    if (!itinerary) {
      throw new AppError(httpStatus.NOT_FOUND, 'Itinerary not found');
    }

    if (!itinerary.aiResponse) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Itinerary data is incomplete');
    }

    const aiResponse = itinerary.aiResponse as any;

    // Find the selected option
    const selectedOption = payload.alternative_options.find(
      option => option.option === payload.selected_option
    );

    if (!selectedOption) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Selected option not found');
    }

    // Update the activity in the AI response
    const updatedAiResponse = { ...aiResponse };
    
    for (const day of updatedAiResponse.days) {
      const activityIndex = day.activities.findIndex(
        (act: IActivity) => act.id === payload.activity_id
      );
      
      if (activityIndex !== -1) {
        day.activities[activityIndex] = {
          id: payload.activity_id,
          time: selectedOption.time,
          title: selectedOption.title,
          description: selectedOption.description,
          place: selectedOption.place,
          keyword: selectedOption.keyword,
        };
        break;
      }
    }

    // Update the itinerary in database
    const updatedItinerary = await prisma.Itinerary.update({
      where: { id: payload.itinerary_id },
      data: {
        aiResponse: updatedAiResponse as any,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Activity updated successfully',
      data: {
        id: updatedItinerary.id,
        aiResponse: updatedItinerary.aiResponse as any,
        status: updatedItinerary.status as 'PENDING' | 'COMPLETED' | 'FAILED',
        createdAt: updatedItinerary.createdAt,
        updatedAt: updatedItinerary.updatedAt,
      },
    };
  } catch (error: any) {
    console.error('Update activity error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update activity. Please try again.'
    );
  }
};

export const ItineraryService = {
  createItinerary,
  getItineraryById,
  getAllItineraries,
  editActivity,
  updateActivity,
};
