import { rateLimit } from 'express-rate-limit';

const handler = (message: string) => ({
  standardHeaders: 'draft-8' as const,
  legacyHeaders: false,
  message: { success: false, message },
});

/** Applied to every /api route. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  ...handler('Too many requests, please try again later'),
});

/** Stricter limit for login/register to slow down credential stuffing. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  ...handler('Too many auth attempts, please try again in 15 minutes'),
});
