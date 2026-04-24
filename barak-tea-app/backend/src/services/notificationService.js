
import nodemailer from 'nodemailer';
import axios from 'axios';
import supabase from '../utils/supabase.js';
import logger from '../utils/logger.js';

let cachedTransporter = null;

function getEmailTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

  if (process.env.SMTP_URL) {
    cachedTransporter = nodemailer.createTransport(process.env.SMTP_URL);
    return cachedTransporter;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !smtpPass) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPass,
    },
  });

  return cachedTransporter;
}

function normalizeWhatsappNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

async function sendWhatsappViaMeta(to, body) {
  const whatsappToken = process.env.WHATSAPP_API_TOKEN;
  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!whatsappToken || !whatsappPhoneNumberId) {
    logger.warn('WhatsApp not configured for admin notifications');
    return false;
  }

  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v19.0';
  const endpoint = `https://graph.facebook.com/${apiVersion}/${whatsappPhoneNumberId}/messages`;

  try {
    await axios.post(
      endpoint,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body },
      },
      {
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );
    return true;
  } catch (error) {
    const details = error.response?.data?.error?.message || error.message;
    logger.error(`Admin WhatsApp notification failed for ${to}: ${details}`);
    return false;
  }
}

export const handleNewOrder = async (order) => {
  try {
    // 1. Fetch notification settings
    const { data: settings, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();

    if (error || !settings) {
      logger.error('Failed to fetch notification settings:', error?.message);
      return;
    }

    const { email_enabled, whatsapp_enabled, email_recipients, whatsapp_recipients } = settings;

    // 2. Prepare order details for message
    const orderItems = order.order_items || [];
    const productList = orderItems.map(item => `- ${item.product_name} (x${item.quantity}) - ₹${item.total_price}`).join('\n');
    
    // Extract customer name from order_notes if it's JSON
    let customerName = 'Customer';
    try {
      if (order.order_notes) {
        const notes = JSON.parse(order.order_notes);
        customerName = notes.customer_name || notes.customerName || 'Customer';
      }
    } catch (e) {
      // Not JSON, use as is or default
    }

    const totalQty = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // 3. Send Email Notifications
    if (email_enabled && email_recipients?.length > 0) {
      const transporter = getEmailTransporter();
      if (transporter) {
        const fromName = process.env.SMTP_FROM_NAME || 'BARAK Tea Admin';
        const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

        const emailHtml = `
          <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #c8922a;">🛒 New Order Received!</h2>
            <p><strong>Order ID:</strong> ${order.order_number}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${order.customer_phone}</p>
            <p><strong>Address:</strong> ${order.shipping_address}</p>
            <p><strong>City:</strong> ${order.customer_city || 'Not specified'}</p>
            <hr />
            <h3>Products:</h3>
            <pre>${productList}</pre>
            <p><strong>Total Quantity:</strong> ${totalQty}</p>
            <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>
            <hr />
            <p><a href="${process.env.ADMIN_PANEL_URL || '#'}" style="background: #c8922a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
          </div>
        `;

        for (const recipient of email_recipients) {
          try {
            await transporter.sendMail({
              from: `"${fromName}" <${fromEmail}>`,
              to: recipient,
              subject: `New Order Alert: ${order.order_number}`,
              html: emailHtml,
            });
            logger.info(`Admin Email notification sent to ${recipient}`);
          } catch (err) {
            logger.error(`Failed to send admin email to ${recipient}: ${err.message}`);
          }
        }
      }
    }

    // 4. Send WhatsApp Notifications
    if (whatsapp_enabled && whatsapp_recipients?.length > 0) {
      const whatsappMsg = [
        `🛒 *New Order Received*`,
        `Order ID: ${order.order_number}`,
        `Customer: ${customerName}`,
        `Phone: ${order.customer_phone}`,
        `Product: ${orderItems[0]?.product_name}${orderItems.length > 1 ? ` + ${orderItems.length - 1} more` : ''}`,
        `Qty: ${totalQty}`,
        `Total: ₹${order.total_amount}`,
        `City: ${order.customer_city || 'Not specified'}`
      ].join('\n');

      for (const phone of whatsapp_recipients) {
        const normalized = normalizeWhatsappNumber(phone);
        if (normalized) {
          await sendWhatsappViaMeta(normalized, whatsappMsg);
          logger.info(`Admin WhatsApp notification sent to ${normalized}`);
        }
      }
    }

  } catch (error) {
    logger.error('Error in handleNewOrder notification:', error.message);
  }
};
