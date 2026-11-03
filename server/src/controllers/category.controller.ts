import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { slugify } from '../utils/slugify';
import { toDTO } from '../utils/serialize';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../validators/catalog.validator';

const byIdOrSlug = (idOrSlug: string) =>
  isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

export const listCategories = async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true, deletedAt: null })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  res.json({ success: true, data: categories.map(toDTO) });
};

export const getCategory = async (req: Request, res: Response) => {
  const category = await Category.findOne({
    ...byIdOrSlug(String(req.params.idOrSlug)),
    isActive: true,
    deletedAt: null,
  }).lean();
  if (!category) throw ApiError.notFound('Category not found');
  res.json({ success: true, data: toDTO(category) });
};

export const createCategory = async (req: Request, res: Response) => {
  const input = req.body as CreateCategoryInput;
  const category = await Category.create({
    ...input,
    slug: input.slug ?? slugify(input.name),
  });
  res.status(201).json({ success: true, data: toDTO(category.toObject()) });
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    req.body as UpdateCategoryInput,
    { returnDocument: 'after', runValidators: true },
  ).lean();
  if (!category) throw ApiError.notFound('Category not found');
  res.json({ success: true, data: toDTO(category) });
};

/** Soft delete, so offline clients receive the removal through /sync. */
export const deleteCategory = async (req: Request, res: Response) => {
  if (await Product.exists({ category: req.params.id, deletedAt: null })) {
    throw ApiError.conflict(
      'Category still has products. Move or delete them first.',
    );
  }
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { deletedAt: new Date() },
  );
  if (!category) throw ApiError.notFound('Category not found');
  res.status(204).end();
};
