import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Syncable } from '../models/plugins/syncable';
import { toDTO } from '../utils/serialize';
import { decodeSyncCursor, encodeSyncCursor } from '../utils/cursor';
import { syncQuery } from '../validators/catalog.validator';

/**
 * Writes newer than this are held back for one more pull. A write can commit
 * slightly after a later-timestamped write; without this window a client could
 * move its cursor past it and never see it. Must exceed app-server clock skew.
 */
const SETTLE_WINDOW_MS = 2000;

type SyncDoc = Syncable & { isActive?: boolean };

/**
 * Pull-based change feed for offline-first clients (SQLite on device).
 *
 * Client loop: GET with the stored cursor (none on first run) → upsert
 * `upserts` and delete `deletes` locally in one SQLite transaction → store
 * `nextCursor` → repeat while `hasMore`.
 */
const changeFeed =
  <T extends SyncDoc>(model: Model<T>) =>
  async (req: Request, res: Response) => {
    const { cursor, limit } = syncQuery.parse(req.query);
    const settledBefore = new Date(Date.now() - SETTLE_WINDOW_MS);

    const filter: Record<string, unknown> = {
      updatedAt: { $lte: settledBefore },
    };
    if (cursor) {
      const pos = decodeSyncCursor(cursor);
      filter.$or = [
        { updatedAt: { $gt: pos.updatedAt, $lte: settledBefore } },
        { updatedAt: pos.updatedAt, _id: { $gt: pos.id } },
      ];
      delete filter.updatedAt;
    }

    const rows = await model
      .find(filter)
      .sort({ updatedAt: 1, _id: 1 })
      .limit(limit + 1)
      .lean();
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    // Deleted and deactivated rows both mean "remove from the device".
    const upserts = [];
    const deletes: string[] = [];
    for (const row of page) {
      if (row.deletedAt || row.isActive === false) deletes.push(String(row._id));
      else upserts.push(toDTO(row));
    }

    const last = page[page.length - 1];
    res.json({
      success: true,
      data: {
        upserts,
        deletes,
        hasMore,
        // No new changes → hand back the same cursor so the client stays put.
        nextCursor: last
          ? encodeSyncCursor({ updatedAt: last.updatedAt, id: last._id })
          : (cursor ?? null),
      },
    });
  };

export const syncCategories = changeFeed(Category);
export const syncProducts = changeFeed(Product);
