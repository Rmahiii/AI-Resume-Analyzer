import { Router } from "express";
import { analyzeResume, dashboard, getAnalysis, listAnalyses } from "../controllers/analysisController.js";
import { requireAuth } from "../middleware/auth.js";
import { analysisLimiter } from "../middleware/rateLimit.js";
import { resumeUpload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { analyzeSchema, idSchema } from "../validators/analysisSchemas.js";

export const analysisRoutes = Router();

analysisRoutes.use(requireAuth);
analysisRoutes.get("/", listAnalyses);
analysisRoutes.get("/dashboard", dashboard);
analysisRoutes.get("/:id", validate(idSchema), getAnalysis);
analysisRoutes.post(
  "/",
  analysisLimiter,
  resumeUpload.single("resume"),
  validate(analyzeSchema),
  analyzeResume
);
