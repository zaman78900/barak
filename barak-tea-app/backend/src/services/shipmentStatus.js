export const SHIPMENT_STATUS = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

const STATUS_PATTERNS = [
  {
    status: SHIPMENT_STATUS.DELIVERED,
    patterns: [
      /delivered/i,
      /successfully delivered/i,
      /shipment delivered/i,
      /item delivered/i,
      /proof of delivery/i,
    ],
  },
  {
    status: SHIPMENT_STATUS.OUT_FOR_DELIVERY,
    patterns: [
      /out\s+for\s+delivery/i,
      /with delivery executive/i,
      /with delivery agent/i,
      /arrived at delivery hub/i,
      /delivery attempt/i,
    ],
  },
  {
    status: SHIPMENT_STATUS.IN_TRANSIT,
    patterns: [
      /in[\s-]?transit/i,
      /reached hub/i,
      /departed/i,
      /bag dispatched/i,
      /manifested/i,
      /picked up/i,
      /picked-up/i,
      /collected/i,
      /arrived/i,
      /forwarded/i,
    ],
  },
  {
    status: SHIPMENT_STATUS.CANCELLED,
    patterns: [
      /cancelled/i,
      /canceled/i,
      /rto/i,
      /return to origin/i,
      /returned to shipper/i,
      /shipment returned/i,
      /undelivered/i,
      /delivery cancelled/i,
    ],
  },
  {
    status: SHIPMENT_STATUS.SHIPPED,
    patterns: [
      /shipped/i,
      /ready to ship/i,
      /booked/i,
      /awb generated/i,
      /consignment created/i,
      /waybill generated/i,
      /accepted/i,
    ],
  },
];

export const ACTIVE_SHIPMENT_STATUSES = [
  SHIPMENT_STATUS.PENDING,
  SHIPMENT_STATUS.SHIPPED,
  SHIPMENT_STATUS.IN_TRANSIT,
  SHIPMENT_STATUS.OUT_FOR_DELIVERY,
];

export const TERMINAL_SHIPMENT_STATUSES = [
  SHIPMENT_STATUS.DELIVERED,
  SHIPMENT_STATUS.CANCELLED,
  SHIPMENT_STATUS.RETURNED,
];

export function normalizeShipmentStatus(rawStatus, fallback = SHIPMENT_STATUS.SHIPPED) {
  const value = String(rawStatus || '').trim();
  if (!value) return fallback;

  for (const entry of STATUS_PATTERNS) {
    if (entry.patterns.some(pattern => pattern.test(value))) {
      return entry.status;
    }
  }

  return fallback;
}

export function isTerminalShipmentStatus(status) {
  return TERMINAL_SHIPMENT_STATUSES.includes(status);
}

export function mapShipmentStatusToOrderStatus(status) {
  if (status === SHIPMENT_STATUS.DELIVERED) return 'delivered';
  if (status === SHIPMENT_STATUS.CANCELLED || status === SHIPMENT_STATUS.RETURNED) return 'cancelled';
  if (
    status === SHIPMENT_STATUS.SHIPPED ||
    status === SHIPMENT_STATUS.IN_TRANSIT ||
    status === SHIPMENT_STATUS.OUT_FOR_DELIVERY
  ) {
    return 'shipped';
  }

  return 'processing';
}

export function getShipmentStatusLabel(status) {
  const labels = {
    [SHIPMENT_STATUS.PENDING]: 'Pending',
    [SHIPMENT_STATUS.SHIPPED]: 'Shipped',
    [SHIPMENT_STATUS.IN_TRANSIT]: 'In Transit',
    [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [SHIPMENT_STATUS.DELIVERED]: 'Delivered',
    [SHIPMENT_STATUS.CANCELLED]: 'Cancelled',
    [SHIPMENT_STATUS.RETURNED]: 'Returned',
  };

  return labels[status] || status;
}
