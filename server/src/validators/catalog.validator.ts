import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

const objectId = z
  .string()
  .refine(v => isValidObjectId(v), { message: 'Invalid id' });
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug');
const paise = z.number().int().min(0);
const boolQuery = z.enum(['true', 'false']).transform(v => v === 'true');

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: slug.optional(),
  description: z.string().trim().max(300).optional(),
  image: z.url().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export const updateCategorySchema = createCategorySchema.partial();

const productBase = z.object({
  name: z.string().trim().min(2).max(100),
  slug: slug.optional(),
  description: z.string().trim().max(1000).optional(),
  category: objectId,
  price: paise,
  mrp: paise.optional(),
  images: z.array(z.url()).max(10).optional(),
  isVeg: z.boolean().optional(),
  tags: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(20).optional(),
  sortOrder: z.number().int().optional(),
  isAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
const mrpNotBelowPrice = (p: { price?: number; mrp?: number }) =>
  p.mrp === undefined || p.price === undefined || p.mrp >= p.price;

export const createProductSchema = productBase.refine(mrpNotBelowPrice, {
  message: 'mrp must be greater than or equal to price',
  path: ['mrp'],
});
export const updateProductSchema = productBase
  .partial()
  .refine(mrpNotBelowPrice, {
    message: 'mrp must be greater than or equal to price',
    path: ['mrp'],
  });

export const listProductsQuery = z.object({
  category: objectId.optional(),
  q: z.string().trim().min(1).max(100).optional(),
  isVeg: boolQuery.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const syncQuery = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuery>;
export type SyncQuery = z.infer<typeof syncQuery>;
