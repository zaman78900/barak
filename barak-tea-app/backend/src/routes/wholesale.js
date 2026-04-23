import express from 'express';
import supabase from '../utils/supabase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get wholesale enquiries (admin)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('wholesale_enquiries').select('*', { count: 'exact' });

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      enquiries: data,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
    });
  } catch (error) {
    logger.error(`Get wholesale enquiries error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Submit wholesale enquiry
router.post('/', async (req, res) => {
  try {
    const { business_name, contact_name, phone, email, city, monthly_quantity_kg, message } = req.body;

    if (!business_name || !phone) {
      return res.status(400).json({ error: 'Business name and phone required' });
    }

    const { data, error } = await supabase
      .from('wholesale_enquiries')
      .insert([{
        business_name,
        contact_name,
        phone,
        email,
        city,
        monthly_quantity_kg,
        message,
        status: 'new',
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

// Update enquiry status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('wholesale_enquiries')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Wholesale enquiry status updated: ${id} -> ${status}`);
    res.json(data);
  } catch (error) {
    logger.error(`Update wholesale enquiry error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
