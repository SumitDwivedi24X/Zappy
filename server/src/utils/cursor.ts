import { Types, isValidObjectId } from 'mongoose';
import { ApiError } from './ApiError';

/**
 * Opaque cursors for keyset pagination. Unlike skip/limit, keyset pagination
 * stays O(log n) on deep pages and doesn't skip/duplicate rows under writes.
 */

export const encodeIdCursor = (id: Types.ObjectId | string) =>
  Buffer.from(String(id)).toString('base64url');

export const decodeIdCursor = (cursor: string) => {
  const id = Buffer.from(cursor, 'base64url').toString();
  if (!isValidObjectId(id)) throw ApiError.badRequest('Invalid cursor');
  return new Types.ObjectId(id);
};

/** Change-feed cursor: position in the `{ updatedAt, _id }` order. */
export interface SyncPosition {
  updatedAt: Date;
  id: Types.ObjectId;
}

export const encodeSyncCursor = ({ updatedAt, id }: SyncPosition) =>
  Buffer.from(`${updatedAt.getTime()}:${id}`).toString('base64url');

export const decodeSyncCursor = (cursor: string): SyncPosition => {
  const [ms, id] = Buffer.from(cursor, 'base64url').toString().split(':');
  const time = Number(ms);
  if (!Number.isFinite(time) || !isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid sync cursor');
  }
  return { updatedAt: new Date(time), id: new Types.ObjectId(id) };
};
