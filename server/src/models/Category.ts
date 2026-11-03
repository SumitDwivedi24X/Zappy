import { Schema, model } from 'mongoose';
import { syncable, Syncable } from './plugins/syncable';

export interface ICategory extends Syncable {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 300 },
    image: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.plugin(syncable);
// Slug only needs to be unique among live categories, so a deleted slug can be reused.
categorySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
categorySchema.index({ isActive: 1, deletedAt: 1, sortOrder: 1 });

export const Category = model<ICategory>('Category', categorySchema);
