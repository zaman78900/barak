import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ─── PUBLIC: Guest order creation (no auth required) ──────────────────────
router.post('/guest', async (req, res) => {
  try {
    const {
      items,
      total_amount,
      shipping_address,
      customer_info,   // { name, email, phone }
      payment_method,
      order_number,
      coupon_code,
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order items required' });
    }
    if (!customer_info?.phone) {
      return res.status(400).json({ error: 'Customer phone is required' });
    }

    const orderNum = order_number || `BRK-${Date.now()}`;

    // Build shipping address string if object supplied
    const shippingStr =
      typeof shipping_address === 'object'
        ? [shipping_address.line1, shipping_address.line2, shipping_address.city,
           shipping_address.state, shipping_address.pin, 'India']
            .filter(Boolean).join(', ')
        : (shipping_address || '');

    // Create the order row (customer_name stored in order_notes, city from address)
    const customerCity = typeof shipping_address === 'object' ? (shipping_address.city || null) : null;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number:     orderNum,
        customer_phone:   customer_info.phone,
        customer_email:   customer_info.email || null,
        customer_city:    customerCity,
        total_amount:     total_amount || 0,
        shipping_address: shippingStr,
        payment_method:   payment_method || 'online',
        coupon_code:      coupon_code   || null,
        order_notes:      customer_info.name ? `Customer: ${customer_info.name}` : null,
        status:           'pending',
        channel:          'web',
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items — only if product_id is available; otherwise store by name only
    // Filter items to those that have a product_id (NOT NULL constraint), or use a workaround
    const orderItems = items
      .filter(item => item.product_id) // only items with valid product_id
      .map((item) => ({
        order_id:     order.id,
        product_id:   item.product_id,
        product_name: item.name         || 'Unknown',
        quantity:     item.quantity      || item.qty || 1,
        variant:      item.variant       || item.size || 'Standard',
        unit_price:   item.price         || 0,
        total_price:  (item.price || 0) * (item.quantity || item.qty || 1),
      }));

    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        logger.error(`Order items insert error: ${itemsError.message}`);
        // Don't fail the whole order — order is created, items are best-effort
      }
    } else {
      logger.warn(`[Guest Order] No product_ids provided — order_items skipped for ${orderNum}`);
    }

    logger.info(`[Guest Order] Created: ${orderNum} | ₹${total_amount}`);

    res.status(201).json({
      id:           order.id,
      order_number: order.order_number,
      status:       order.status,
      total_amount: order.total_amount,
    });
  } catch (error) {
    logger.error(`Guest order error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('orders').select('*, order_items(*)', { count: 'exact' });

    // Regular users see only their orders
    if (req.user.role !== 'admin') {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (customer) {
        query = query.eq('customer_id', customer.id);
      } else {
        return res.json({ orders: [], pagination: { page: 1, limit, total: 0, pages: 0 } });
      }
    }

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      orders: data,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
    });
  } catch (error) {
    logger.error(`Get orders error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get order details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*), shipments(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (error) {
    logger.error(`Get order error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, total_amount, shipping_address, order_notes, coupon_code } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order items required' });
    }

    // Get customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('id, phone')
      .eq('user_id', userId)
      .single();

    if (!customer) {
      return res.status(404).json({ error: 'Customer record not found' });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_id: customer.id,
        customer_phone: customer.phone,
        total_amount,
        shipping_address,
        order_notes,
        coupon_code,
        status: 'pending',
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      variant: item.variant,
      unit_price: item.price,
      total_price: item.quantity * item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    logger.info(`Order created: ${orderNumber}`);

    res.status(201).json(order);
  } catch (error) {
    logger.error(`Create order error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Order status updated: ${id} -> ${status}`);
    res.json(order);
  } catch (error) {
    logger.error(`Update order error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
