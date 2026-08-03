import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hash, token } from "../utils/text.js";
import { signAccessToken } from "../utils/jwt.js";
import { sendResetEmail } from "../services/mailService.js";

const adminEmails = new Set(env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()));

function sendSession(res, user) {
  const accessToken = signAccessToken(user);
  res.cookie(env.COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  });
  return res.json({ accessToken, user: user.toSafeJSON() });
}

export const signup = asyncHandler(async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: adminEmails.has(req.body.email) ? "admin" : "user"
  });
  await user.setPassword(req.body.password);
  await user.save();
  return res.status(201).json(sendSessionPayload(res, user));
});

function sendSessionPayload(res, user) {
  const accessToken = signAccessToken(user);
  res.cookie(env.COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  });
  return { accessToken, user: user.toSafeJSON() };
}

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+passwordHash");
  if (!user || !(await user.verifyPassword(req.body.password))) {
    throw new AppError(401, "Invalid email or password.");
  }
  user.lastLoginAt = new Date();
  await user.save();
  return sendSession(res, user);
});

export const googleLogin = asyncHandler(async (req, res) => {
  if (!env.GOOGLE_CLIENT_ID) throw new AppError(503, "Google OAuth is not configured.");
  const ticket = await new OAuth2Client(env.GOOGLE_CLIENT_ID).verifyIdToken({
    idToken: req.body.credential,
    audience: env.GOOGLE_CLIENT_ID
  });
  const profile = ticket.getPayload();
  if (!profile?.email || !profile.email_verified) throw new AppError(401, "Google account is not verified.");

  let user = await User.findOne({ email: profile.email.toLowerCase() });
  if (!user) {
    user = await User.create({
      name: profile.name || profile.email.split("@")[0],
      email: profile.email,
      googleId: profile.sub,
      role: adminEmails.has(profile.email.toLowerCase()) ? "admin" : "user"
    });
  } else if (!user.googleId) {
    user.googleId = profile.sub;
    await user.save();
  }
  return sendSession(res, user);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.COOKIE_NAME);
  res.status(204).send();
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const resetToken = token();
    user.resetPasswordHash = hash(resetToken);
    user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    await sendResetEmail({
      email: user.email,
      resetUrl: `${env.CLIENT_URL}/reset-password?token=${resetToken}`
    });
  }
  res.json({ message: "If that email exists, a reset link has been sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetPasswordHash: hash(req.body.token),
    resetPasswordExpiresAt: { $gt: new Date() }
  }).select("+resetPasswordHash");
  if (!user) throw new AppError(400, "Reset link is invalid or expired.");
  await user.setPassword(req.body.password);
  user.resetPasswordHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();
  return sendSession(res, user);
});
