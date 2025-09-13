import express from 'express';
import { ItineraryController } from './itinerary.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { itineraryValidation } from './itinerary.validation';

const router = express.Router();

// Create itinerary
router.post(
  '/',
  auth,
  validateRequest(itineraryValidation.createItinerarySchema),
  ItineraryController.createItinerary
);

// Get itinerary by ID
router.get(
  '/:id',
  auth,
  ItineraryController.getItineraryById
);

// Get all itineraries
router.get(
  '/',
  auth,
  ItineraryController.getAllItineraries
);

// Edit activity
router.put(
  '/edit-activity',
  auth,
  validateRequest(itineraryValidation.editActivitySchema),
  ItineraryController.editActivity
);

// Update activity
router.put(
  '/update-activity',
  auth,
  validateRequest(itineraryValidation.updateActivitySchema),
  ItineraryController.updateActivity
);

export const itineraryRouter = router;
