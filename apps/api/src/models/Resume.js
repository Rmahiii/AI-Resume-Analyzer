import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    byteSize: { type: Number, required: true },
    text: { type: String, required: true, select: false },
    parsed: {
      contact: { email: String, phone: String, links: [String] },
      skills: [String],
      education: [String],
      experience: [String],
      projects: [String],
      certifications: [String],
      sections: [String]
    }
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
