import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { logger } from '../utils/logger';

/** Creates (or promotes) the admin account from ADMIN_* env vars. */
const run = async () => {
  const { ADMIN_NAME = 'Zappy Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }

  await connectDB();

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    logger.info(`Promoted existing user ${ADMIN_EMAIL} to admin`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    logger.info(`Created admin ${ADMIN_EMAIL}`);
  }

  await disconnectDB();
};

run().catch(async err => {
  logger.error({ err }, 'Seeding admin failed');
  await disconnectDB();
  process.exit(1);
});
