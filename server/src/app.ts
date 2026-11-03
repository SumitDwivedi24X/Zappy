import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import { env } from './config/env';
import { logger } from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFound } from './middleware/errorHandler';
import v1Routes from './routes/v1';

export const createApp = () => {
  const app = express();

  // Needed so rate limiting sees the real client IP behind a proxy/load balancer.
  app.set('trust proxy', 1);

  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const id = (req.headers['x-request-id'] as string) ?? randomUUID();
        res.setHeader('x-request-id', id);
        return id;
      },
      customLogLevel: (_req, res, err) =>
        err || res.statusCode >= 500
          ? 'error'
          : res.statusCode >= 400
            ? 'warn'
            : 'info',
    }),
  );
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS === '*' ? true : env.CORS_ORIGINS.split(','),
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      db: mongoose.connection.readyState === 1 ? 'up' : 'down',
      uptime: process.uptime(),
    });
  });

  app.use('/api', apiLimiter);
  app.use('/api/v1', v1Routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
