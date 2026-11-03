import { Request, Response } from 'express';
import { isValidObjectId, QueryFilter } from 'mongoose';
import { Product, IProduct } from '../models/Product';
import { Category } from '../models/Category';
import { ApiError } from '../utils/ApiError';
import { slugify } from '../utils/slugify';
import { toDTO } from '../utils/serialize';
import { decodeIdCursor, encodeIdCursor } from '../utils/cursor';
import {
  CreateProductInput,
  listProductsQuery,
  UpdateProductInput,
} from '../validators/catalog.validator';

const byIdOrSlug = (idOrSlug: string) =>
  isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

const assertCategoryExists = async (id: string) => {
  if (!(await Category.exists({ _id: id, deletedAt: null }))) {
    throw ApiError.badRequest('Category does not exist');
  }
};

/** Keyset-paginated listing: newest first, `?cursor=` from the previous page. */
export const listProducts = async (req: Request, res: Response) => {
  const { category, q, isVeg, cursor, limit } = listProductsQuery.parse(
    req.query,
  );

  const filter: QueryFilter<IProduct> = { isActive: true, deletedAt: null };
  if (category) filter.category = category;
  if (isVeg !== undefined) filter.isVeg = isVeg;
  if (q) filter.$text = { $search: q };
  if (cursor) filter._id = { $lt: decodeIdCursor(cursor) };

  // Fetch one extra row to know whether another page exists.
  const rows = await Product.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  res.json({
    success: true,
    data: items.map(toDTO),
    pageInfo: {
      hasMore,
      nextCursor: hasMore ? encodeIdCursor(items[items.length - 1]._id) : null,
    },
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findOne({
    ...byIdOrSlug(String(req.params.idOrSlug)),
    isActive: true,
    deletedAt: null,
  })
    .populate({
      path: 'category',
      select: 'name slug',
      transform: (doc, id) => (doc ? toDTO(doc) : id),
    })
    .lean();
  if (!product) throw ApiError.notFound('Product not found');
  res.json({ success: true, data: toDTO(product) });
};

export const createProduct = async (req: Request, res: Response) => {
  const input = req.body as CreateProductInput;
  await assertCategoryExists(input.category);
  const product = await Product.create({
    ...input,
    slug: input.slug ?? slugify(input.name),
  });
  res.status(201).json({ success: true, data: toDTO(product.toObject()) });
};

export const updateProduct = async (req: Request, res: Response) => {
  const input = req.body as UpdateProductInput;
  if (input.category) await assertCategoryExists(input.category);

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    input,
    { returnDocument: 'after', runValidators: true },
  ).lean();
  if (!product) throw ApiError.notFound('Product not found');
  res.json({ success: true, data: toDTO(product) });
};

/** Soft delete, so offline clients receive the removal through /sync. */
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { deletedAt: new Date() },
  );
  if (!product) throw ApiError.notFound('Product not found');
  res.status(204).end();
};
