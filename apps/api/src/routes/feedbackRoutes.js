import { Router } from "express";
import { createFeedback } from "../controllers/feedbackController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { feedbackSchema } from "../validators/analysisSchemas.js";

export const feedbackRoutes = Router();

feedbackRoutes.post("/", requireAuth, validate(feedbackSchema), createFeedback);
