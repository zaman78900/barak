import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { verifyToken } from '../utils/auth.js';
import {
  createShipment,
  getShipmentById,
  getShipmentByTrackingId,
  getShipmentRealtimeConfig,
  getSupportedCouriers,
  listAvailableOrders,
  listShipments,
  updateShipmentStatus,
} from '../services/shipmentService.js';
import { triggerShipmentCheck } from '../services/shipmentScheduler.js';

const router = express.Router();

function isCronAuthorized(req) {
  const cronSecret = process.env.SHIPMENT_CRON_SECRET;
  return Boolean(cronSecret) && req.headers['x-cron-secret'] === cronSecret;
}

function isAdminAuthorized(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const decoded = verifyToken(authHeader.slice(7));
  return decoded?.role === 'admin';
}

router.get('/couriers', authenticate, authorize(['admin']), async (_req, res) => {
  res.json({
    couriers: getSupportedCouriers(),
    realtime: getShipmentRealtimeConfig(),
  });
});

router.get('/available-orders', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const orders = await listAvailableOrders(limit);
    res.json({ orders });
  } catch (error) {
    logger.error(`Available orders error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const payload = await listShipments(req.query);
    res.json(payload);
  } catch (error) {
    logger.error(`Get shipments error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.get('/track/:trackingId', async (req, res) => {
  try {
    const shipment = await getShipmentByTrackingId(req.params.trackingId);
    res.json(shipment);
  } catch (error) {
    logger.error(`Track shipment error: ${error.message}`);
    res.status(404).json({ error: 'Shipment not found' });
  }
});

router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const shipment = await getShipmentById(req.params.id);
    res.json(shipment);
  } catch (error) {
    logger.error(`Get shipment error: ${error.message}`);
    res.status(404).json({ error: 'Shipment not found' });
  }
});

router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const payload = {
      order_id: req.body.order_id || req.body.orderId,
      tracking_id: req.body.tracking_id || req.body.tracking_number || req.body.tracking,
      courier: req.body.courier || req.body.courier_partner || req.body.partner,
    };

    const result = await createShipment(payload);
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Create shipment error: ${error.message}`);

    if (error.message === 'active_shipment_already_exists') {
      return res.status(409).json({ error: 'An active shipment already exists for this order' });
    }

    if (error.message === 'order_id_and_tracking_id_required') {
      return res.status(400).json({ error: 'Order ID and tracking ID are required' });
    }

    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await updateShipmentStatus(req.params.id, status, {
      source: 'admin_override',
      rawStatus: `Admin updated shipment to ${status}`,
    });

    res.json(result);
  } catch (error) {
    logger.error(`Update shipment error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.post('/check', async (req, res) => {
  try {
    const adminAuthorized = isAdminAuthorized(req);

    if (!adminAuthorized && !isCronAuthorized(req)) {
      return res.status(401).json({ error: 'Unauthorized cron request' });
    }

    const summary = await triggerShipmentCheck(adminAuthorized ? 'admin_endpoint' : 'cron_endpoint');
    res.json(summary);
  } catch (error) {
    logger.error(`Shipment check error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
