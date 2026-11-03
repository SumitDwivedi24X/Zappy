import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';
import { createApp } from './app';

const start = async () => {
  await connectDB();

  const server = createApp().listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

process.on('unhandledRejection', reason => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  process.exit(1);
});

start().catch(err => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
