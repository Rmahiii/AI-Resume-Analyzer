import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: "resume-signal"
  });
}

export function verifyAccessToken(accessToken) {
  return jwt.verify(accessToken, env.JWT_SECRET, { issuer: "resume-signal" });
}
