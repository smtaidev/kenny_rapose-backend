import express from "express";
import { ItineraryController } from "./itinerary.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { itineraryValidation } from "./itinerary.validation";

const router = express.Router();

// Create itinerary
router.post(
  "/",
  auth,
  validateRequest(itineraryValidation.createItinerarySchema),
  ItineraryController.createItinerary
);

// Get itinerary by ID
router.get("/:id", auth, ItineraryController.getItineraryById);

// Add activity to itinerary
router.post(
  "/add-activity",
  auth,
  validateRequest(itineraryValidation.addActivitySchema),
  ItineraryController.addActivity
);

// Get all itineraries
router.get("/", auth, ItineraryController.getAllItineraries);

// Update activity
router.patch(
  "/update-activity",
  auth,
  validateRequest(itineraryValidation.updateActivitySchema),
  ItineraryController.updateActivity
);

// Delete activity
router.delete(
  "/delete-activity",
  auth,
  validateRequest(itineraryValidation.deleteActivitySchema),
  ItineraryController.deleteActivity
);

// Delete itinerary
router.delete(
  "/delete-itinerary",
  auth,
  validateRequest(itineraryValidation.deleteItinerarySchema),
  ItineraryController.deleteItinerary
);

export const itineraryRouter = router;
