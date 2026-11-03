import { Router } from 'express';
import * as sync from '../../controllers/sync.controller';

const router = Router();

// Catalog is public data; per-user feeds (cart, orders) will require auth.
router.get('/categories', sync.syncCategories);
router.get('/products', sync.syncProducts);

export default router;
