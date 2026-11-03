import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ApiError } from '../utils/ApiError';

export const validateObjectIdParam =
  (param: string): RequestHandler =>
  (req, _res, next) => {
    if (!isValidObjectId(req.params[param])) {
      throw ApiError.badRequest(`Invalid ${param}`);
    }
    next();
  };
