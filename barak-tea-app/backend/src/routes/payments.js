import express from 'express';
import Stripe from 'stripe';
import supabase from '../utils/supabase.js';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create payment intent for checkout
router.post('/create-payment-intent', authenticate, async (req, res) => {
  try {
    const { amount, orderId, customerEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId,
        userId: req.user.userId,
      },
      receipt_email: customerEmail,
      description: `BARAK Tea Order #${orderId}`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    logger.error(`Payment intent error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment and update order
router.post('/confirm-payment', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status in Supabase
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          payment_id: paymentIntentId,
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Payment confirmed',
        orderId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    logger.error(`Confirm payment error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        logger.info(`Payment succeeded: ${paymentIntent.id}`);

        // Update order in database
        await supabase
          .from('orders')
          .update({ payment_status: 'completed' })
          .eq('payment_id', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        logger.error(`Payment failed: ${failedPayment.id}`);

        // Update order status
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('payment_id', failedPayment.id);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`Webhook error: ${error.message}`);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Get payment methods
router.get('/payment-methods', authenticate, async (req, res) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card',
    });

    res.json({ paymentMethods: paymentMethods.data });
  } catch (error) {
    logger.error(`Get payment methods error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
