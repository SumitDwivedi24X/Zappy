import { RequestHandler } from 'express';
import { ZodType } from 'zod';

/**
 * Validates and replaces req.body with the parsed (trimmed, coerced) value.
 * Validation errors are forwarded to the global error handler.
 */
export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
