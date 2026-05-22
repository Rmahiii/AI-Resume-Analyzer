import { ZodError } from "zod";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} was not found.` });
}

export function errorHandler(error, req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(422).json({ message: "Validation failed.", issues: error.issues });
  }
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Session expired or invalid." });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "That value is already in use." });
  }

  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) logger.error("Request failed", { error, path: req.originalUrl });

  return res.status(statusCode).json({
    message: statusCode >= 500 ? "Unexpected server error." : error.message,
    ...(error.details ? { details: error.details } : {}),
    ...(env.NODE_ENV === "development" && statusCode >= 500 ? { stack: error.stack } : {})
  });
}
