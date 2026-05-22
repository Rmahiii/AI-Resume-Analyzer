import { Router } from "express";
import { adminOverview } from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const adminRoutes = Router();

adminRoutes.get("/overview", requireAuth, requireAdmin, adminOverview);
