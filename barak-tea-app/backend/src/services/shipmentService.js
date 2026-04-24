import supabase from '../utils/supabase.js';
import logger from '../utils/logger.js';
import {
  ACTIVE_SHIPMENT_STATUSES,
  SHIPMENT_STATUS,
  isTerminalShipmentStatus,
  mapShipmentStatusToOrderStatus,
  normalizeShipmentStatus,
} from './shipmentStatus.js';
import { fetchTrackingStatus, getCourierOptions } from './shipmentTracking.js';
import { sendShipmentNotifications } from './shipmentNotifications.js';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
}

function extractCustomerName(order) {
  if (!order?.order_notes) return null;

  try {
    const parsed = JSON.parse(order.order_notes);
    if (parsed && typeof parsed === 'object') {
      return parsed.customer_name || parsed.customerName || parsed.name || null;
    }
  } catch (_error) {
    // Legacy plain-text notes handled below.
  }

  const match = String(order.order_notes).match(/Customer:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

function buildShipmentTimeline(previousEvents = [], entry) {
  const existingEvents = Array.isArray(previousEvents) ? previousEvents : [];
  return [entry, ...existingEvents].slice(0, 20);
}

function buildOrderSnapshot(order) {
  return {
    order_number: order.order_number,
    customer_name: extractCustomerName(order),
    customer_phone: order.customer_phone,
    customer_email: order.customer_email,
    customer_city: order.customer_city,
    shipping_address: order.shipping_address,
  };
}

function buildShipmentSelect() {
  return `
    *,
    orders (
      id,
      order_number,
      customer_phone,
      customer_email,
      customer_city,
      shipping_address,
      order_notes,
      status
    )
  `;
}

function transformShipment(shipment) {
  const order = shipment.orders || {};
  const orderSnapshot = parseJsonField(shipment.order_snapshot, {});

  return {
    ...shipment,
    courier: shipment.courier_partner,
    tracking_id: shipment.tracking_id || shipment.tracking_number,
    customer_name: orderSnapshot.customer_name || extractCustomerName(order),
    city: orderSnapshot.customer_city || order.customer_city || null,
    order_number: order.order_number || orderSnapshot.order_number || null,
    tracking_events: parseJsonField(shipment.tracking_events, []),
    tracking_meta: parseJsonField(shipment.tracking_meta, {}),
    notification_state: parseJsonField(shipment.notification_state, {}),
  };
}

async function fetchOrderForShipment(orderId) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_phone, customer_email, customer_city, shipping_address, order_notes, status')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  if (!order) throw new Error('order_not_found');

  return order;
}

async function ensureNoActiveShipment(orderId) {
  const { data: existingShipment, error } = await supabase
    .from('shipments')
    .select('id, status')
    .eq('order_id', orderId)
    .in('status', ACTIVE_SHIPMENT_STATUSES)
    .maybeSingle();

  if (error) throw error;
  if (existingShipment) {
    throw new Error('active_shipment_already_exists');
  }
}

export async function listShipments({ status, page = 1, limit = 20 } = {}) {
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 20;
  const offset = (safePage - 1) * safeLimit;

  let query = supabase.from('shipments').select(buildShipmentSelect(), { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('updated_at', { ascending: false })
    .range(offset, offset + safeLimit - 1);

  if (error) throw error;

  return {
    shipments: (data || []).map(transformShipment),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: count || 0,
    },
  };
}

export async function getShipmentById(id) {
  const { data, error } = await supabase
    .from('shipments')
    .select(buildShipmentSelect())
    .eq('id', id)
    .single();

  if (error) throw error;

  return transformShipment(data);
}

export async function getShipmentByTrackingId(trackingId) {
  const { data, error } = await supabase
    .from('shipments')
    .select(buildShipmentSelect())
    .or(`tracking_id.eq.${trackingId},tracking_number.eq.${trackingId}`)
    .single();

  if (error) throw error;

  return transformShipment(data);
}

export async function listAvailableOrders(limit = 50) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      customer_phone,
      customer_email,
      customer_city,
      shipping_address,
      order_notes,
      status,
      shipments(id, status)
    `)
    .neq('status', 'delivered')
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || [])
    .filter(order => !(order.shipments || []).some(shipment => ACTIVE_SHIPMENT_STATUSES.includes(shipment.status)))
    .map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: extractCustomerName(order),
      city: order.customer_city,
      status: order.status,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
    }));
}

export async function createShipment({ order_id, tracking_id, courier }) {
  if (!order_id || !tracking_id) {
    throw new Error('order_id_and_tracking_id_required');
  }

  const order = await fetchOrderForShipment(order_id);
  await ensureNoActiveShipment(order_id);

  const shipmentPayload = {
    order_id,
    tracking_id,
    tracking_number: tracking_id,
    courier_partner: courier || 'India Post',
    status: SHIPMENT_STATUS.SHIPPED,
    last_checked_at: new Date().toISOString(),
    last_raw_status: 'Shipment created by admin',
    status_message: 'Shipment created and awaiting first tracking sync',
    order_snapshot: buildOrderSnapshot(order),
    tracking_events: [
      {
        at: new Date().toISOString(),
        raw: 'Shipment created by admin',
        normalized_status: SHIPMENT_STATUS.SHIPPED,
      },
    ],
    tracking_meta: {
      source: 'admin_create',
    },
    notification_state: {
      last_notified_status: SHIPMENT_STATUS.SHIPPED,
      last_notified_at: new Date().toISOString(),
    },
  };

  const { data: shipment, error } = await supabase
    .from('shipments')
    .insert([shipmentPayload])
    .select(buildShipmentSelect())
    .single();

  if (error) throw error;

  await supabase
    .from('orders')
    .update({ status: mapShipmentStatusToOrderStatus(SHIPMENT_STATUS.SHIPPED), updated_at: new Date().toISOString() })
    .eq('id', order_id);

  const transformedShipment = transformShipment(shipment);
  const notifications = await sendShipmentNotifications(order, transformedShipment, null);

  logger.info(`[Shipment Service] Created shipment ${tracking_id} for order ${order.order_number}`);

  return {
    shipment: transformedShipment,
    notifications,
  };
}

export async function updateShipmentStatus(id, nextStatus, metadata = {}) {
  const normalizedStatus = normalizeShipmentStatus(nextStatus, SHIPMENT_STATUS.SHIPPED);
  const currentShipment = await getShipmentById(id);
  const previousStatus = currentShipment.status;
  const now = new Date().toISOString();

  const updatePayload = {
    status: normalizedStatus,
    updated_at: now,
    last_checked_at: metadata.checkedAt || now,
    last_raw_status: metadata.rawStatus || currentShipment.last_raw_status,
    status_message: metadata.rawStatus || currentShipment.status_message,
    tracking_meta: {
      ...(currentShipment.tracking_meta || {}),
      ...(metadata.meta || {}),
    },
    tracking_events: buildShipmentTimeline(currentShipment.tracking_events, {
      at: metadata.checkedAt || now,
      raw: metadata.rawStatus || normalizedStatus,
      normalized_status: normalizedStatus,
      source: metadata.source || 'manual',
    }),
  };

  if (normalizedStatus === SHIPMENT_STATUS.DELIVERED) {
    updatePayload.actual_delivery = now;
  }

  if (normalizedStatus === SHIPMENT_STATUS.CANCELLED || normalizedStatus === SHIPMENT_STATUS.RETURNED) {
    updatePayload.actual_delivery = null;
  }

  if (previousStatus !== normalizedStatus) {
    updatePayload.notification_state = {
      ...(currentShipment.notification_state || {}),
      last_notified_status: normalizedStatus,
      last_notified_at: now,
    };
  }

  const { data: shipment, error } = await supabase
    .from('shipments')
    .update(updatePayload)
    .eq('id', id)
    .select(buildShipmentSelect())
    .single();

  if (error) throw error;

  await supabase
    .from('orders')
    .update({ status: mapShipmentStatusToOrderStatus(normalizedStatus), updated_at: now })
    .eq('id', shipment.order_id);

  const transformedShipment = transformShipment(shipment);
  const notifications = await sendShipmentNotifications(shipment.orders || {}, transformedShipment, previousStatus);

  logger.info(`[Shipment Service] Shipment ${id} status ${previousStatus} -> ${normalizedStatus}`);

  return {
    shipment: transformedShipment,
    notifications,
  };
}

export async function syncShipmentStatus(shipment) {
  const transformedShipment = transformShipment(shipment);
  const trackingResult = await fetchTrackingStatus(
    transformedShipment.tracking_id || transformedShipment.tracking_number,
    transformedShipment.courier_partner
  );

  const nextStatus = normalizeShipmentStatus(trackingResult.rawStatus || trackingResult.status, transformedShipment.status);

  if (nextStatus === transformedShipment.status) {
    const now = trackingResult.checkedAt || new Date().toISOString();
    await supabase
      .from('shipments')
      .update({
        last_checked_at: now,
        updated_at: transformedShipment.updated_at,
        last_raw_status: trackingResult.rawStatus,
        status_message: trackingResult.rawStatus,
        failure_count: 0,
        tracking_meta: {
          ...(transformedShipment.tracking_meta || {}),
          tracking_url: trackingResult.trackingUrl,
          source: trackingResult.source,
        },
      })
      .eq('id', transformedShipment.id);

    return {
      changed: false,
      shipment: transformedShipment,
      tracking: trackingResult,
    };
  }

  const updatedShipment = await updateShipmentStatus(transformedShipment.id, nextStatus, {
    checkedAt: trackingResult.checkedAt,
    rawStatus: trackingResult.rawStatus,
    source: trackingResult.source,
    meta: {
      tracking_url: trackingResult.trackingUrl,
      source: trackingResult.source,
    },
  });

  return {
    changed: true,
    shipment: updatedShipment.shipment,
    notifications: updatedShipment.notifications,
    tracking: trackingResult,
  };
}

export async function checkAllShipments() {
  const delayMs = Number(process.env.SHIPMENT_TRACKING_DELAY_MS || 1500);
  const batchSize = Number(process.env.SHIPMENT_TRACKING_BATCH_SIZE || 25);
  const minRecheckMinutes = Number(process.env.SHIPMENT_MIN_RECHECK_MINUTES || 25);
  const minCheckedAt = new Date(Date.now() - minRecheckMinutes * 60 * 1000).toISOString();

  const { data: shipments, error } = await supabase
    .from('shipments')
    .select(buildShipmentSelect())
    .in('status', ACTIVE_SHIPMENT_STATUSES)
    .or(`last_checked_at.is.null,last_checked_at.lt.${minCheckedAt}`)
    .order('last_checked_at', { ascending: true, nullsFirst: true })
    .limit(batchSize);

  if (error) throw error;

  const summary = {
    checked: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
    shipments: [],
  };

  for (const shipment of shipments || []) {
    try {
      summary.checked += 1;
      const result = await syncShipmentStatus(shipment);

      if (result.changed) {
        summary.updated += 1;
      } else {
        summary.skipped += 1;
      }

      summary.shipments.push({
        id: shipment.id,
        tracking_id: shipment.tracking_id || shipment.tracking_number,
        status: result.shipment.status,
        changed: result.changed,
      });
    } catch (syncError) {
      summary.failed += 1;

      await supabase
        .from('shipments')
        .update({
          last_checked_at: new Date().toISOString(),
          failure_count: (shipment.failure_count || 0) + 1,
          tracking_meta: {
            ...parseJsonField(shipment.tracking_meta, {}),
            last_error: syncError.message,
          },
        })
        .eq('id', shipment.id);

      logger.error(`[Shipment Service] Failed to sync ${shipment.id}: ${syncError.message}`);
    }

    if (delayMs > 0) {
      await wait(delayMs);
    }
  }

  return summary;
}

export function getSupportedCouriers() {
  return getCourierOptions();
}

export function getShipmentRealtimeConfig() {
  return {
    enabled: true,
    provider: 'supabase_realtime',
    fallback: 'polling',
  };
}

export { isTerminalShipmentStatus };
