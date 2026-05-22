import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { analysisRoutes } from "./routes/analysisRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { feedbackRoutes } from "./routes/feedbackRoutes.js";
import { sanitizeMongo } from "./middleware/sanitizeMongo.js";

export const app = express();

const allowedOrigins = new Set([
  env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(sanitizeMongo);
app.use(hpp());
app.use("/api/v1", apiLimiter);

app.get("/api/v1/health", (_req, res) => res.json({ ok: true, service: "resume-signal-api" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/analyses", analysisRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);
