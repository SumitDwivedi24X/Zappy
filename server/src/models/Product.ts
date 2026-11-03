import { Schema, Types, model } from 'mongoose';
import { syncable, Syncable } from './plugins/syncable';

export interface IProduct extends Syncable {
  name: string;
  slug: string;
  description?: string;
  category: Types.ObjectId;
  /** Selling price in paise (integer) — matches Razorpay's amount unit, avoids float errors. */
  price: number;
  /** Optional strike-through price in paise. */
  mrp?: number;
  images: string[];
  isVeg: boolean;
  tags: string[];
  sortOrder: number;
  isAvailable: boolean;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    isVeg: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.plugin(syncable);
productSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
// Supports the main listing query: live products in a category, newest first.
productSchema.index({ category: 1, isActive: 1, deletedAt: 1, _id: -1 });
productSchema.index(
  { name: 'text', tags: 'text', description: 'text' },
  { weights: { name: 10, tags: 5, description: 1 }, name: 'product_text' },
);

export const Product = model<IProduct>('Product', productSchema);
