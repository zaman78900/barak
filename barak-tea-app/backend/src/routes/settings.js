
import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get notification settings
router.get('/notifications', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        // Return default settings
        return res.json({
          email_enabled: true,
          whatsapp_enabled: false,
          email_recipients: [],
          whatsapp_recipients: []
        });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    logger.error(`Get notification settings error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update notification settings
router.post('/notifications', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { email_enabled, whatsapp_enabled, email_recipients, whatsapp_recipients } = req.body;

    // Validate emails
    if (email_recipients && Array.isArray(email_recipients)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = email_recipients.filter(email => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        return res.status(400).json({ error: `Invalid email format: ${invalidEmails.join(', ')}` });
      }
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from('notification_settings')
      .select('id')
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('notification_settings')
        .update({
          email_enabled,
          whatsapp_enabled,
          email_recipients,
          whatsapp_recipients,
          updated_at: new Date()
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('notification_settings')
        .insert([{
          email_enabled,
          whatsapp_enabled,
          email_recipients,
          whatsapp_recipients
        }])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.json(result.data);
  } catch (error) {
    logger.error(`Update notification settings error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
