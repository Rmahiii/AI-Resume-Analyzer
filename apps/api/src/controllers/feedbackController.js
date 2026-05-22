import { Feedback } from "../models/Feedback.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanText } from "../utils/text.js";

export const createFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.create({
    user: req.user.id,
    analysis: req.body.analysisId,
    rating: req.body.rating,
    message: cleanText(req.body.message)
  });
  res.status(201).json({ feedback });
});
