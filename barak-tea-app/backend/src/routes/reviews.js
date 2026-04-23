import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const { product_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('reviews').select('*', { count: 'exact' }).eq('status', 'approved');

    if (product_id) query = query.eq('product_id', product_id);

    const { data, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      reviews: data,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
    });
  } catch (error) {
    logger.error(`Get reviews error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { product_id, rating, headline, body } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id,
        customer_id: customer?.id,
        rating,
        headline,
        body,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Review submitted for product: ${product_id}`);
    res.status(201).json(data);
  } catch (error) {
    logger.error(`Create review error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject review (admin)
router.patch('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Review ${status}: ${id}`);
    res.json(data);
  } catch (error) {
    logger.error(`Update review error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
