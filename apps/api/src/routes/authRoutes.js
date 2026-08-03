import { Router } from "express";
import {
  forgotPassword,
  finishGoogleOAuth,
  googleLogin,
  login,
  logout,
  me,
  resetPassword,
  signup,
  startGoogleOAuth
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  googleSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema
} from "../validators/authSchemas.js";

export const authRoutes = Router();

authRoutes.post("/signup", authLimiter, validate(signupSchema), signup);
authRoutes.post("/login", authLimiter, validate(loginSchema), login);
authRoutes.get("/google", authLimiter, startGoogleOAuth);
authRoutes.get("/google/callback", authLimiter, finishGoogleOAuth);
authRoutes.post("/google", authLimiter, validate(googleSchema), googleLogin);
authRoutes.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
authRoutes.post("/reset-password", authLimiter, validate(resetPasswordSchema), resetPassword);
authRoutes.get("/me", requireAuth, me);
authRoutes.post("/logout", requireAuth, logout);
