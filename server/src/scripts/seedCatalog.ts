import { connectDB, disconnectDB } from '../config/db';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { slugify } from '../utils/slugify';
import { logger } from '../utils/logger';

/** Dev-only sample menu. Idempotent: upserts by slug. Prices in paise. */
const MENU: Record<string, { name: string; price: number; isVeg: boolean; tags: string[] }[]> = {
  Burgers: [
    { name: 'Classic Veg Burger', price: 9900, isVeg: true, tags: ['burger'] },
    { name: 'Crispy Chicken Burger', price: 14900, isVeg: false, tags: ['burger', 'chicken'] },
  ],
  Pizza: [
    { name: 'Margherita Pizza', price: 19900, isVeg: true, tags: ['pizza', 'cheese'] },
    { name: 'Pepperoni Pizza', price: 29900, isVeg: false, tags: ['pizza'] },
  ],
  Biryani: [
    { name: 'Veg Dum Biryani', price: 17900, isVeg: true, tags: ['rice', 'biryani'] },
    { name: 'Hyderabadi Chicken Biryani', price: 24900, isVeg: false, tags: ['rice', 'biryani', 'chicken'] },
  ],
  Beverages: [
    { name: 'Cold Coffee', price: 8900, isVeg: true, tags: ['coffee', 'cold'] },
    { name: 'Fresh Lime Soda', price: 5900, isVeg: true, tags: ['soda', 'cold'] },
  ],
};

const run = async () => {
  await connectDB();

  let sortOrder = 0;
  for (const [categoryName, items] of Object.entries(MENU)) {
    const category = await Category.findOneAndUpdate(
      { slug: slugify(categoryName), deletedAt: null },
      { name: categoryName, sortOrder: sortOrder++ },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    for (const item of items) {
      await Product.findOneAndUpdate(
        { slug: slugify(item.name), deletedAt: null },
        { ...item, category: category._id },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }
  }

  logger.info(`Seeded ${Object.keys(MENU).length} categories`);
  await disconnectDB();
};

run().catch(async err => {
  logger.error({ err }, 'Seeding catalog failed');
  await disconnectDB();
  process.exit(1);
});
