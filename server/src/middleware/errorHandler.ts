import { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError, z } from 'zod';
import { ApiError } from '../utils/ApiError';
import { isProd } from '../config/env';

export const notFound: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof ApiError) {
    ({ statusCode, message, details } = err);
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = z.flattenError(err).fieldErrors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message]),
    );
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for ${Object.keys(err.keyValue ?? {}).join(', ')}`;
  } else if (err?.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON body';
  }

  if (statusCode >= 500) {
    req.log.error({ err }, 'Unhandled error');
  } else {
    req.log.warn({ statusCode, message }, 'Request failed');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details !== undefined && { details }),
    ...(!isProd && statusCode >= 500 && { stack: err?.stack }),
  });
};
