import { Router } from 'express';
import * as categories from '../../controllers/category.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { cachePublic } from '../../middleware/cache';
import { validateBody } from '../../middleware/validate';
import { validateObjectIdParam } from '../../middleware/validateObjectId';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validators/catalog.validator';

const router = Router();
const adminOnly = [authenticate, authorize('admin')];

router.get('/', cachePublic(), categories.listCategories);
router.get('/:idOrSlug', cachePublic(), categories.getCategory);

router.post('/', adminOnly, validateBody(createCategorySchema), categories.createCategory);
router.patch(
  '/:id',
  adminOnly,
  validateObjectIdParam('id'),
  validateBody(updateCategorySchema),
  categories.updateCategory,
);
router.delete('/:id', adminOnly, validateObjectIdParam('id'), categories.deleteCategory);

export default router;
