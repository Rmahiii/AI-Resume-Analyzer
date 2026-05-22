import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export async function sendResetEmail({ email, resetUrl }) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    logger.info("Password reset email suppressed; SMTP not configured", { email, resetUrl });
    return;
  }

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  });

  await transport.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: "Reset your Resume Signal password",
    text: `Reset your password: ${resetUrl}`
  });
}
