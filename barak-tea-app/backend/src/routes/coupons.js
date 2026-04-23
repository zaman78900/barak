import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, order_total } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Coupon code required' });
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (error) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    // Check validity period
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return res.status(400).json({ error: 'Coupon not yet valid' });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return res.status(400).json({ error: 'Coupon expired' });
    }

    // Check usage limit
    if (coupon.max_usage_limit && coupon.current_usage >= coupon.max_usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }

    // Check minimum order amount
    if (coupon.minimum_order_amount && order_total < coupon.minimum_order_amount) {
      return res.status(400).json({ 
        error: `Minimum order amount of ₹${coupon.minimum_order_amount} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = (order_total * coupon.discount_value) / 100;
    } else if (coupon.discount_type === 'fixed') {
      discount = coupon.discount_value;
    } else if (coupon.discount_type === 'shipping') {
      discount = 0; // Handled separately
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.discount_type,
        value: coupon.discount_value,
        discount_amount: discount,
      },
    });
  } catch (error) {
    logger.error(`Validate coupon error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get all coupons (admin)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ coupons: data });
  } catch (error) {
    logger.error(`Get coupons error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create coupon (admin)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { code, discount_type, discount_value, minimum_order_amount, max_usage_limit, valid_from, valid_until } = req.body;

    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        code: code.toUpperCase(),
        discount_type,
        discount_value,
        minimum_order_amount: minimum_order_amount || 0,
        max_usage_limit,
        valid_from,
        valid_until,
      }])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Coupon created: ${code}`);
    res.status(201).json(data);
  } catch (error) {
    logger.error(`Create coupon error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
