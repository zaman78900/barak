import axios from 'axios';
import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import { getShipmentStatusLabel } from './shipmentStatus.js';

let cachedTransporter = null;

function extractCustomerName(order) {
  if (!order?.order_notes) return null;

  try {
    const parsed = JSON.parse(order.order_notes);
    if (parsed && typeof parsed === 'object') {
      return parsed.customer_name || parsed.customerName || parsed.name || null;
    }
  } catch (_error) {
    // Legacy plain-text notes are handled below.
  }

  const match = String(order.order_notes).match(/Customer:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

function normalizeWhatsappNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (String(phone).startsWith('+')) return String(phone);
  return `+${digits}`;
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

function buildShipmentContent(order, shipment, isCreationEvent) {
  const customerName = extractCustomerName(order) || order?.customer_name || 'Customer';
  const statusLabel = getShipmentStatusLabel(shipment.status);
  const title = isCreationEvent ? 'Shipment Created' : `Shipment ${statusLabel}`;
  const message = isCreationEvent
    ? `Your order ${order.order_number} has been shipped.`
    : `Your shipment for order ${order.order_number} is now ${statusLabel}.`;
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_FROM_EMAIL || 'support@baraktea.com';
  const supportPhone = process.env.SUPPORT_PHONE || process.env.BUSINESS_PHONE || '+91 00000 00000';

  const subject = `BARAK Tea: ${title} - ${order.order_number}`;
  const text = [
    `Hello ${customerName},`,
    '',
    message,
    `Courier: ${shipment.courier_partner || shipment.courier || 'Not assigned'}`,
    `Tracking ID: ${shipment.tracking_number || shipment.tracking_id}`,
    `Current Status: ${statusLabel}`,
    '',
    `If you need help, contact us at ${supportEmail} or ${supportPhone}.`,
    '',
    'BARAK Tea',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #221508; line-height: 1.6;">
      <p>Hello ${customerName},</p>
      <p>${message}</p>
      <div style="background: #faf3e0; border: 1px solid #c8922a; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${order.order_number}</p>
        <p style="margin: 0 0 8px;"><strong>Courier:</strong> ${shipment.courier_partner || shipment.courier || 'Not assigned'}</p>
        <p style="margin: 0 0 8px;"><strong>Tracking ID:</strong> ${shipment.tracking_number || shipment.tracking_id}</p>
        <p style="margin: 0;"><strong>Status:</strong> ${statusLabel}</p>
      </div>
      <p>If you need help, contact us at ${supportEmail} or ${supportPhone}.</p>
      <p>BARAK Tea</p>
    </div>
  `;

  const whatsappText = [
    `Hello ${customerName},`,
    message,
    `Order: ${order.order_number}`,
    `Courier: ${shipment.courier_partner || shipment.courier || 'Not assigned'}`,
    `Tracking: ${shipment.tracking_number || shipment.tracking_id}`,
    `Status: ${statusLabel}`,
    `Help: ${supportPhone}`,
    'BARAK Tea',
  ].join('\n');

  return { subject, text, html, whatsappText };
}

async function sendEmail(order, content) {
  if (!order?.customer_email) {
    return { attempted: false, sent: false, skipped: true, reason: 'missing_customer_email' };
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    return { attempted: false, sent: false, skipped: true, reason: 'email_not_configured' };
  }

  const fromName = process.env.SMTP_FROM_NAME || 'BARAK Tea';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: order.customer_email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  return { attempted: true, sent: true, skipped: false, reason: null };
}

async function sendWhatsapp(order, content) {
  const whatsappToken = process.env.WHATSAPP_API_TOKEN;
  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = normalizeWhatsappNumber(order?.customer_phone)?.replace(/^\+/, '');

  if (!to) {
    return { attempted: false, sent: false, skipped: true, reason: 'missing_customer_phone' };
  }

  if (!whatsappToken || !whatsappPhoneNumberId) {
    return { attempted: false, sent: false, skipped: true, reason: 'whatsapp_not_configured' };
  }

  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v19.0';

  await axios.post(
    `https://graph.facebook.com/${apiVersion}/${whatsappPhoneNumberId}/messages`,
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

  return { attempted: true, sent: true, skipped: false, reason: null };
}

export async function sendShipmentNotifications(order, shipment, previousStatus) {
  if (!order?.order_number || !shipment?.status) {
    return { skipped: true, reason: 'invalid_payload' };
  }

  if (previousStatus && previousStatus === shipment.status) {
    return { skipped: true, reason: 'status_unchanged' };
  }

  const content = buildShipmentContent(order, shipment, !previousStatus);
  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendEmail(order, content),
    sendWhatsapp(order, content),
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
    `[Shipment Notifications] ${order.order_number} -> ${shipment.status} | email=${notifications.email.sent ? 'sent' : notifications.email.skipped ? `skipped:${notifications.email.reason}` : `failed:${notifications.email.reason}`} | whatsapp=${notifications.whatsapp.sent ? 'sent' : notifications.whatsapp.skipped ? `skipped:${notifications.whatsapp.reason}` : `failed:${notifications.whatsapp.reason}`}`
  );

  return notifications;
}
