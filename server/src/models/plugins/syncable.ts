import { Schema } from 'mongoose';

/**
 * Makes a collection offline-sync friendly:
 *  - `deletedAt` soft delete, so clients can learn about removals via the change feed.
 *  - `{ updatedAt, _id }` index, which backs the cursor-based change feed in /sync.
 *
 * Requires the schema to use `timestamps: true`.
 */
export const syncable = (schema: Schema) => {
  schema.add({ deletedAt: { type: Date, default: null } });
  schema.index({ updatedAt: 1, _id: 1 });
};

export interface Syncable {
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
