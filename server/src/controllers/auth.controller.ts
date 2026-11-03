import { Request, Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { issueTokens, verifyRefreshToken } from '../services/token.service';
import {
  LoginInput,
  RefreshInput,
  RegisterInput,
} from '../validators/auth.validator';

export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body as RegisterInput;

  if (await User.exists({ email })) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Role is never taken from the request body — admins are created via seed script.
  const user = await User.create({ name, email, phone, password });

  res.status(201).json({
    success: true,
    data: { user, ...issueTokens(user) },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email }).select('+password +tokenVersion');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  res.json({
    success: true,
    data: { user, ...issueTokens(user) },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body as RefreshInput;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || user.tokenVersion !== payload.tv) {
    throw ApiError.unauthorized('Refresh token has been revoked');
  }

  res.json({ success: true, data: issueTokens(user) });
};

/** Revokes every refresh token issued to this user (all devices). */
export const logout = async (req: Request, res: Response) => {
  await User.updateOne({ _id: req.user!.id }, { $inc: { tokenVersion: 1 } });
  res.json({ success: true, message: 'Logged out' });
};

export const me = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw ApiError.notFound('User not found');
  res.json({ success: true, data: { user } });
};
