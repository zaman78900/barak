import axios from 'axios';
import nodemailer from 'nodemailer';
import logger from './logger.js';

const PAYMENT_METHOD_LABELS = {
  upi: 'UPI',
  card: 'Credit / Debit Card',
  netbanking: 'Net Banking',
  cod: 'Cash on Delivery',
  online: 'Online Payment',
};

const STATUS_COPY = {
  pending: {
    title: 'Order Received',
    message: 'We have received your order and it is waiting for confirmation.',
  },
  confirmed: {
    title: 'Order Confirmed',
    message: 'Your order has been confirmed and will be prepared shortly.',
  },
  processing: {
    title: 'Order Processing',
    message: 'Your order is now being packed and prepared for dispatch.',
  },
  shipped: {
    title: 'Order Shipped',
    message: 'Your order has been shipped and is on the way.',
  },
  delivered: {
    title: 'Order Delivered',
    message: 'Your order has been delivered. We hope you enjoy your tea.',
  },
  cancelled: {
    title: 'Order Cancelled',
    message: 'Your order has been cancelled. Please contact support if you need help.',
  },
};

let cachedTransporter = null;

function extractCustomerName(order) {
  if (!order?.order_notes) return null;

  try {
    const parsed = JSON.parse(order.order_notes);
    if (parsed && typeof parsed === 'object') {
      return parsed.customer_name || parsed.customerName || parsed.name || null;
    }
  } catch (_error) {
    // Legacy plain-text order notes are handled below.
  }

  const match = String(order.order_notes).match(/Customer:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

function getCustomerName(order) {
  return extractCustomerName(order) || 'Customer';
}

function getPaymentMethodLabel(paymentMethod) {
  return PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || 'Not specified';
}

function getStatusContent(status) {
  return STATUS_COPY[status] || {
    title: 'Order Status Updated',
    message: `Your order status has been updated to ${status}.`,
  };
}

function normalizeWhatsappNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

function buildNotificationContent(order) {
  const customerName = getCustomerName(order);
  const { title, message } = getStatusContent(order.status);
  const paymentLabel = getPaymentMethodLabel(order.payment_method);
  const amount = Number(order.total_amount || 0).toLocaleString('en-IN');
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_FROM_EMAIL || 'support@baraktea.com';
  const supportPhone = process.env.SUPPORT_PHONE || process.env.BUSINESS_PHONE || '+91 00000 00000';

  const subject = `BARAK Tea: ${title} for ${order.order_number}`;
  const text = [
    `Hello ${customerName},`,
    '',
    message,
    '',
    `Order Number: ${order.order_number}`,
    `Current Status: ${title}`,
    `Order Total: Rs. ${amount}`,
    `Payment Method: ${paymentLabel}`,
    '',
    `If you need any help, reply to this email or contact us at ${supportEmail} / ${supportPhone}.`,
    '',
    'Thank you,',
    'BARAK Tea',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #221508; line-height: 1.6;">
      <p>Hello ${customerName},</p>
      <p>${message}</p>
      <div style="background: #faf3e0; border: 1px solid #c8922a; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${order.order_number}</p>
        <p style="margin: 0 0 8px;"><strong>Current Status:</strong> ${title}</p>
        <p style="margin: 0 0 8px;"><strong>Order Total:</strong> Rs. ${amount}</p>
        <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentLabel}</p>
      </div>
      <p>If you need any help, reply to this email or contact us at ${supportEmail} / ${supportPhone}.</p>
      <p>Thank you,<br />BARAK Tea</p>
    </div>
  `;

  const whatsappText = [
    `Hello ${customerName},`,
    `${message}`,
    `Order: ${order.order_number}`,
    `Status: ${title}`,
    `Total: Rs. ${amount}`,
    `Payment: ${paymentLabel}`,
    `Need help? Contact ${supportPhone}.`,
    'BARAK Tea',
  ].join('\n');

  return { subject, text, html, whatsappText };
}

function getEmailTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

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

async function sendEmailNotification(order, content) {
  const result = { attempted: false, sent: false, skipped: false, reason: null };

  if (!order.customer_email) {
    return { ...result, skipped: true, reason: 'missing_customer_email' };
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    return { ...result, skipped: true, reason: 'email_not_configured' };
  }

  const fromName = process.env.SMTP_FROM_NAME || 'BARAK Tea';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  result.attempted = true;
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: order.customer_email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  return { ...result, sent: true };
}

async function sendWhatsappNotification(order, content) {
  const result = { attempted: false, sent: false, skipped: false, reason: null };

  const whatsappToken = process.env.WHATSAPP_API_TOKEN;
  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = normalizeWhatsappNumber(order.customer_phone);

  if (!to) {
    return { ...result, skipped: true, reason: 'missing_customer_phone' };
  }
  if (!whatsappToken || !whatsappPhoneNumberId) {
    return { ...result, skipped: true, reason: 'whatsapp_not_configured' };
  }

  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v19.0';
  const endpoint = `https://graph.facebook.com/${apiVersion}/${whatsappPhoneNumberId}/messages`;

  result.attempted = true;
  await axios.post(
    endpoint,
    {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: content.whatsappText,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    }
  );

  return { ...result, sent: true };
}

export async function sendOrderStatusNotifications(order, previousStatus) {
  if (!order?.status || !order?.order_number) {
    return {
      skipped: true,
      reason: 'invalid_order_payload',
    };
  }

  if (previousStatus && previousStatus === order.status) {
    return {
      skipped: true,
      reason: 'status_unchanged',
    };
  }

  const content = buildNotificationContent(order);

  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendEmailNotification(order, content),
    sendWhatsappNotification(order, content),
  ]);

  const notifications = {
    email: emailResult.status === 'fulfilled'
      ? emailResult.value
      : { attempted: true, sent: false, skipped: false, reason: emailResult.reason?.message || 'email_send_failed' },
    whatsapp: whatsappResult.status === 'fulfilled'
      ? whatsappResult.value
      : { attempted: true, sent: false, skipped: false, reason: whatsappResult.reason?.message || 'whatsapp_send_failed' },
  };

  logger.info(
    `[Order Notifications] ${order.order_number} -> ${order.status} | email=${notifications.email.sent ? 'sent' : notifications.email.skipped ? `skipped:${notifications.email.reason}` : `failed:${notifications.email.reason}`} | whatsapp=${notifications.whatsapp.sent ? 'sent' : notifications.whatsapp.skipped ? `skipped:${notifications.whatsapp.reason}` : `failed:${notifications.whatsapp.reason}`}`
  );

  return notifications;
}
