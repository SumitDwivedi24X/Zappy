import { Router } from 'express';
import * as products from '../../controllers/product.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { cachePublic } from '../../middleware/cache';
import { validateBody } from '../../middleware/validate';
import { validateObjectIdParam } from '../../middleware/validateObjectId';
import {
  createProductSchema,
  updateProductSchema,
} from '../../validators/catalog.validator';

const router = Router();
const adminOnly = [authenticate, authorize('admin')];

router.get('/', cachePublic(), products.listProducts);
router.get('/:idOrSlug', cachePublic(), products.getProduct);

router.post('/', adminOnly, validateBody(createProductSchema), products.createProduct);
router.patch(
  '/:id',
  adminOnly,
  validateObjectIdParam('id'),
  validateBody(updateProductSchema),
  products.updateProduct,
);
router.delete('/:id', adminOnly, validateObjectIdParam('id'), products.deleteProduct);

export default router;
