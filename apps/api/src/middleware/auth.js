import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const bearer = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  const accessToken = bearer || req.cookies?.[env.COOKIE_NAME];
  if (!accessToken) throw new AppError(401, "Authentication required.");

  const claims = verifyAccessToken(accessToken);
  req.user = await User.findById(claims.sub);
  if (!req.user) throw new AppError(401, "Session user no longer exists.");
  next();
});

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== "admin") return next(new AppError(403, "Admin access required."));
  return next();
}
