import express from 'express';
import { supabaseAdmin } from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get wholesale enquiries (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('wholesale_enquiries').select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      enquiries: data,
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total: count,
        pages: Math.ceil(count / limit)
      },
    });
  } catch (error) {
    logger.error(`Get wholesale enquiries error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Submit wholesale enquiry (public)
router.post('/', async (req, res) => {
  try {
    const { business_name, contact_name, phone, email, city, monthly_quantity_kg, message } = req.body;

    if (!business_name || !phone) {
      return res.status(400).json({ error: 'Business name and phone required' });
    }

    const qty = monthly_quantity_kg ? parseFloat(monthly_quantity_kg) : null;

    const { data, error } = await supabaseAdmin
      .from('wholesale_enquiries')
      .insert([{
        business_name,
        contact_name: contact_name || '',
        phone,
        email: email || '',
        city: city || '',
        monthly_quantity_kg: qty,
        message: message || '',
        status: 'new',
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Wholesale enquiry received: ${business_name}`);
    res.status(201).json(data);
  } catch (error) {
    logger.error(`Create wholesale enquiry error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update wholesale enquiry (admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updates = {
      updated_at: new Date()
    };
    if (status) updates.status = status;

    const { data, error } = await supabaseAdmin
      .from('wholesale_enquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Wholesale enquiry updated: ${id} -> ${status}`);
    res.json(data);
  } catch (error) {
    logger.error(`Update wholesale enquiry error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Patch status fallback (admin only)
router.patch('/:id/status', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabaseAdmin
      .from('wholesale_enquiries')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Wholesale enquiry status patched: ${id} -> ${status}`);
    res.json(data);
  } catch (error) {
    logger.error(`Patch wholesale enquiry status error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
