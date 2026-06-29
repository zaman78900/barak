import express from 'express';
import { supabaseAdmin } from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Email validation helper
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// ─── PUBLIC ENDPOINT: Submit Contact Form ────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert([{
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Contact message received from: ${name} (${email}) - Subject: ${subject}`);
    res.status(201).json({ success: true, message: 'Message sent successfully', data });
  } catch (error) {
    logger.error(`Create contact message error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ─── ADMIN ENDPOINT: Get All Contact Messages ───────────────────────────────
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('contact_messages').select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      messages: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error(`Get contact messages error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ─── ADMIN ENDPOINT: Update Message Status / Notes ───────────────────────────
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = {
      updated_at: new Date()
    };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Contact message updated: ${id} -> status: ${status}, notes updated`);
    res.json(data);
  } catch (error) {
    logger.error(`Update contact message error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
