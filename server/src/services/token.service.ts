import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../models/User';

export interface AccessTokenPayload {
  sub: string;
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string;
  tv: number; // tokenVersion
}

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  });

export const signRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload &
    AccessTokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload &
    RefreshTokenPayload;

export const issueTokens = (user: {
  id: string;
  role: Role;
  tokenVersion: number;
}) => ({
  accessToken: signAccessToken({ sub: user.id, role: user.role }),
  refreshToken: signRefreshToken({ sub: user.id, tv: user.tokenVersion }),
});
