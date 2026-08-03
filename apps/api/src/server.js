import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { hasGoogleOAuthConfig } from "./config/passport.js";

async function start() {
  await connectDatabase();
  if (!hasGoogleOAuthConfig) {
    logger.error("Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before using /auth/google.");
  }
  app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT}`);
  });
}

start().catch((error) => {
  logger.error("API failed to start", { error });
  process.exit(1);
});
