import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('disconnected', () =>
    logger.warn('MongoDB disconnected'),
  );
  mongoose.connection.on('error', err =>
    logger.error({ err }, 'MongoDB connection error'),
  );

  await mongoose.connect(env.MONGODB_URI);
};

export const disconnectDB = () => mongoose.disconnect();
