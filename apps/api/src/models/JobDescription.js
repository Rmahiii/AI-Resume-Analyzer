import mongoose from "mongoose";

const jobDescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, trim: true, default: "Target role" },
    company: { type: String, trim: true },
    text: { type: String, required: true },
    keywords: [String]
  },
  { timestamps: true }
);

export const JobDescription = mongoose.model("JobDescription", jobDescriptionSchema);
