import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import hpp from "hpp";
import { env } from "./config/env.js";
import { passport } from "./config/passport.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { analysisRoutes } from "./routes/analysisRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { feedbackRoutes } from "./routes/feedbackRoutes.js";
import { sanitizeMongo } from "./middleware/sanitizeMongo.js";

export const app = express();

const allowedOrigins = [
  "https://ai-resume-analyzer-web-six.vercel.app",
  env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(session({
  name: "resume_signal_sid",
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(sanitizeMongo);
app.use(hpp());
app.use("/api/v1", apiLimiter);

app.get("/", (_req, res) => res.json({ ok: true, service: "resume-signal-api" }));
app.get("/api/v1/health", (_req, res) => res.json({ ok: true, service: "resume-signal-api" }));
app.use("/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/analyses", analysisRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);
