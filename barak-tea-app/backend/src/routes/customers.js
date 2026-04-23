import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all customers (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('customers').select('*', { count: 'exact' });

    if (search) {
      query = query.or(`phone.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      customers: data,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
    });
  } catch (error) {
    logger.error(`Get customers error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get customer profile
router.get('/profile/me', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;

    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    res.json(customer);
  } catch (error) {
    logger.error(`Get customer profile error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update customer profile
router.put('/profile/me', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    const { phone, city } = req.body;

    const { data: customer, error } = await supabase
      .from('customers')
      .update({ phone, city, updated_at: new Date() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Customer profile updated: ${userId}`);
    res.json(customer);
  } catch (error) {
    logger.error(`Update customer profile error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
