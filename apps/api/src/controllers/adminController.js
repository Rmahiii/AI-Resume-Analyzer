import { Analysis } from "../models/Analysis.js";
import { Feedback } from "../models/Feedback.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminOverview = asyncHandler(async (_req, res) => {
  const [users, analyses, providerUsage, feedback] = await Promise.all([
    User.countDocuments(),
    Analysis.countDocuments(),
    Analysis.aggregate([{ $group: { _id: "$provider", requests: { $sum: 1 } } }]),
    Feedback.find().sort({ createdAt: -1 }).limit(20).populate("user", "name email")
  ]);
  res.json({
    users,
    analyses,
    providerUsage: providerUsage.map((item) => ({ provider: item._id, requests: item.requests })),
    feedback
  });
});
