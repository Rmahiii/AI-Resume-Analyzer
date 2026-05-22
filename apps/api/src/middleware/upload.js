import multer from "multer";
import { AppError } from "../utils/appError.js";

const acceptedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    if (!acceptedTypes.has(file.mimetype)) {
      return callback(new AppError(415, "Upload a PDF or DOCX resume."));
    }
    return callback(null, true);
  }
});
