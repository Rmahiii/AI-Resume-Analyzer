import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function start() {
  await connectDatabase();
  app.listen(env.PORT, () => logger.info(`API listening on port ${env.PORT}`));
}

start().catch((error) => {
  logger.error("API failed to start", { error });
  process.exit(1);
});
