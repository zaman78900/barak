import express from 'express';
import { supabase } from '../utils/supabase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Validate inputs
    if (!email || !phone) {
      return res.status(400).json({ 
        error: 'Email and phone are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate phone format (basic validation for Indian numbers)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        error: 'Invalid phone number format' 
      });
    }

    // Check if already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing && existing.status === 'subscribed') {
      return res.status(409).json({ 
        error: 'Already subscribed with this email',
        message: 'You are already subscribed to our newsletter!'
      });
    }

    if (existing && existing.status === 'unsubscribed') {
      // Resubscribe
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({ status: 'subscribed', phone })
        .eq('id', existing.id);

      if (updateError) throw updateError;

      logger.info(`Resubscribed user: ${email}`);
      return res.status(200).json({ 
        success: true,
        message: 'Welcome back! You have been resubscribed to our newsletter.'
      });
    }

    // New subscription
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email: email.toLowerCase(),
        phone,
        status: 'subscribed'
      }]);

    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint error
        return res.status(409).json({ 
          error: 'This email is already subscribed',
          message: 'You are already subscribed to our newsletter!'
        });
      }
      throw insertError;
    }

    logger.info(`New newsletter subscription: ${email}`);
    res.status(201).json({ 
      success: true,
      message: 'Successfully subscribed! Check your email for the 10% discount code and free tea sample details.'
    });

  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      error: 'Failed to subscribe. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email.toLowerCase());

    if (error) throw error;

    logger.info(`Unsubscribed from newsletter: ${email}`);
    res.json({ 
      success: true,
      message: 'You have been unsubscribed from our newsletter.'
    });

  } catch (error) {
    logger.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ 
      error: 'Failed to unsubscribe. Please try again.' 
    });
  }
});

// Get subscriber count (for admin)
router.get('/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('status', { count: 'exact' });

    if (error) throw error;

    const subscribed = data.filter(d => d.status === 'subscribed').length;
    const unsubscribed = data.filter(d => d.status === 'unsubscribed').length;

    res.json({
      total: data.length,
      subscribed,
      unsubscribed
    });

  } catch (error) {
    logger.error('Newsletter stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
