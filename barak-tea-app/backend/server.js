import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config({ path: '.env' });

import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import orderRoutes from './src/routes/orders.js';
import customerRoutes from './src/routes/customers.js';
import couponRoutes from './src/routes/coupons.js';
import reviewRoutes from './src/routes/reviews.js';
import wholesaleRoutes from './src/routes/wholesale.js';
import shipmentRoutes from './src/routes/shipments.js';
import paymentRoutes from './src/routes/payments.js';
import uploadRoutes from './src/routes/upload.js';
import settingsRoutes from './src/routes/settings.js';


import errorHandler from './src/middleware/errorHandler.js';
import logger from './src/utils/logger.js';
import { startShipmentScheduler } from './src/services/shipmentScheduler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://barak-theta.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

logger.info(`CORS allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Cron-Secret'],
    exposedHeaders: ['Content-Length', 'Authorization'],
    maxAge: 86400,
  })
);

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ limit: '64kb', extended: true }));

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);


app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`BARAK Tea API running on http://0.0.0.0:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'not configured'}`);
  startShipmentScheduler();
});

export default app;
