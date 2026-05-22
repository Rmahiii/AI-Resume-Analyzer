import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    jobDescription: { type: mongoose.Schema.Types.ObjectId, ref: "JobDescription", required: true },
    provider: { type: String, default: "mock" },
    scores: {
      ats: Number,
      keywordMatch: Number,
      formatting: Number,
      completeness: Number,
      readability: Number,
      compatibility: Number,
      match: Number
    },
    missingSkills: [String],
    missingKeywords: [String],
    strengthAreas: [String],
    weakAreas: [String],
    suggestions: [String],
    ai: {
      review: String,
      summary: String,
      bulletEnhancements: [String],
      atsSuggestions: [String],
      projectSuggestions: [String],
      careerSuggestions: [String],
      skillGap: [String],
      interviewQuestions: [String],
      rewriteSuggestions: [String]
    }
  },
  { timestamps: true }
);

analysisSchema.index({ user: 1, createdAt: -1 });

export const Analysis = mongoose.model("Analysis", analysisSchema);
