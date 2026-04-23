import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all shipments (admin)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('shipments').select('*, orders(order_number)', { count: 'exact' });

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      shipments: data,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
    });
  } catch (error) {
    logger.error(`Get shipments error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get shipment by tracking number
router.get('/track/:tracking_number', async (req, res) => {
  try {
    const { tracking_number } = req.params;

    const { data: shipment, error } = await supabase
      .from('shipments')
      .select('*, orders(order_number, customer_city)')
      .eq('tracking_number', tracking_number)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    logger.error(`Get shipment error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create shipment (admin)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { order_id, tracking_number, courier_partner } = req.body;

    if (!order_id || !tracking_number) {
      return res.status(400).json({ error: 'Order ID and tracking number required' });
    }

    const { data, error } = await supabase
      .from('shipments')
      .insert([{
        order_id,
        tracking_number,
        courier_partner,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;

    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'shipped' })
      .eq('id', order_id);

    logger.info(`Shipment created: ${tracking_number}`);
    res.status(201).json(data);
  } catch (error) {
    logger.error(`Create shipment error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update shipment status (admin)
router.patch('/:id/status', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: shipment, error } = await supabase
      .from('shipments')
      .update({ 
        status,
        actual_delivery: status === 'delivered' ? new Date() : null,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update order status if delivered
    if (status === 'delivered') {
      await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', shipment.order_id);
    }

    logger.info(`Shipment status updated: ${id} -> ${status}`);
    res.json(shipment);
  } catch (error) {
    logger.error(`Update shipment error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
