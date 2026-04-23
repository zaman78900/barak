import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Import routes
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import orderRoutes from './src/routes/orders.js';
import customerRoutes from './src/routes/customers.js';
import couponRoutes from './src/routes/coupons.js';
import reviewRoutes from './src/routes/reviews.js';
import wholesaleRoutes from './src/routes/wholesale.js';
import shipmentRoutes from './src/routes/shipments.js';
import paymentRoutes from './src/routes/payments.js';

// Import middleware
import errorHandler from './src/middleware/errorHandler.js';
import logger from './src/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 BARAK Tea API running on http://localhost:${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;
