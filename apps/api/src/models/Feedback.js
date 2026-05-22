import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    analysis: { type: mongoose.Schema.Types.ObjectId, ref: "Analysis" },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
