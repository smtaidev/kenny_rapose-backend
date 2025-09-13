import { Response } from 'express';
import { ItineraryService } from './itinerary.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth';
import { IEditActivityRequest, IUpdateActivityRequest } from '../../interface/itinerary.interface';

const createItinerary = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload = req.body;
  
  const result = await ItineraryService.createItinerary(payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Itinerary created successfully',
    data: result,
  });
});

const getItineraryById = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const result = await ItineraryService.getItineraryById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Itinerary retrieved successfully',
    data: result,
  });
});

const getAllItineraries = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await ItineraryService.getAllItineraries();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Itineraries retrieved successfully',
    data: result,
  });
});

const editActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload: IEditActivityRequest = req.body;
  const result = await ItineraryService.editActivity(payload);
  
  sendResponse(res, {
    statusCode: 200,
    success: result.success,
    message: result.message || 'Activity edit options generated successfully',
    data: result.data,
  });
});

const updateActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload: IUpdateActivityRequest = req.body;
  const result = await ItineraryService.updateActivity(payload);
  
  sendResponse(res, {
    statusCode: 200,
    success: result.success,
    message: result.message || 'Activity updated successfully',
    data: result.data,
  });
});

export const ItineraryController = {
  createItinerary,
  getItineraryById,
  getAllItineraries,
  editActivity,
  updateActivity,
};
