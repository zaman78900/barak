import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../utils/logger.js';
import { SHIPMENT_STATUS, normalizeShipmentStatus } from './shipmentStatus.js';

const DEFAULT_TIMEOUT_MS = Number(process.env.SHIPMENT_TRACKING_TIMEOUT_MS || 15000);

const COURIERS = {
  india_post: {
    code: 'india_post',
    label: 'India Post',
    aliases: ['india post', 'indiapost', 'speed post'],
    trackingUrlTemplate:
      process.env.INDIA_POST_TRACKING_URL_TEMPLATE ||
      'https://www.indiapost.gov.in/MBE/Pages/Content/Speed-Post.aspx?tracking={trackingId}',
    selectors: ['.track-result', '.status', '.tracking-status', '#content'],
  },
  dtdc: {
    code: 'dtdc',
    label: 'DTDC',
    aliases: ['dtdc'],
    trackingUrlTemplate:
      process.env.DTDC_TRACKING_URL_TEMPLATE ||
      'https://www.dtdc.in/tracking/shipment-tracking.asp?tracking-id={trackingId}',
    selectors: ['.track-status', '.tracking-status', '.shipment-status', '#tblResults', 'body'],
  },
  delhivery: {
    code: 'delhivery',
    label: 'Delhivery',
    aliases: ['delhivery'],
    trackingUrlTemplate:
      process.env.DELHIVERY_TRACKING_URL_TEMPLATE ||
      'https://www.delhivery.com/track-v2/package/{trackingId}',
    selectors: ['.trackStatus', '.shipment-status', '.status', 'main', 'body'],
  },
  blue_dart: {
    code: 'blue_dart',
    label: 'Blue Dart',
    aliases: ['blue dart', 'bluedart'],
    trackingUrlTemplate:
      process.env.BLUE_DART_TRACKING_URL_TEMPLATE ||
      'https://www.bluedart.com/tracking?tracking-id={trackingId}',
    selectors: ['.trackDart', '.shipment-status', '.status', 'body'],
  },
  own_delivery: {
    code: 'own_delivery',
    label: 'Own Delivery',
    aliases: ['own delivery', 'self'],
    manualOnly: true,
  },
};

function normalizeCourierCode(courier) {
  const value = String(courier || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!value) return 'india_post';

  const exactMatch = Object.values(COURIERS).find(config => config.code === value);
  if (exactMatch) return exactMatch.code;

  const aliasMatch = Object.values(COURIERS).find(config =>
    config.aliases?.some(alias => alias.toLowerCase() === value.replace(/_/g, ' '))
  );

  return aliasMatch?.code || value;
}

export function getCourierOptions() {
  return Object.values(COURIERS).map(({ code, label }) => ({ code, label }));
}

function getCourierConfig(courier) {
  const code = normalizeCourierCode(courier);
  return COURIERS[code] || {
    code,
    label: courier || code,
    trackingUrlTemplate: process.env.DEFAULT_TRACKING_URL_TEMPLATE || '',
    selectors: ['body'],
  };
}

function interpolateTrackingUrl(template, trackingId) {
  if (!template) return null;
  return template.replaceAll('{trackingId}', encodeURIComponent(trackingId));
}

function extractCandidateLines($, selectors) {
  const candidates = new Set();

  for (const selector of selectors) {
    $(selector).each((_index, element) => {
      const text = $(element).text().replace(/\s+/g, ' ').trim();
      if (text) {
        candidates.add(text);
      }
    });
  }

  $('script, style, noscript').remove();
  const fullText = $('body').text().replace(/\s+/g, '\n');
  fullText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .forEach(line => candidates.add(line));

  return [...candidates];
}

function scoreStatusLine(line) {
  const normalized = normalizeShipmentStatus(line, null);

  if (!normalized) return { score: 0, status: null };
  if (normalized === SHIPMENT_STATUS.DELIVERED) return { score: 100, status: normalized };
  if (normalized === SHIPMENT_STATUS.OUT_FOR_DELIVERY) return { score: 90, status: normalized };
  if (normalized === SHIPMENT_STATUS.IN_TRANSIT) return { score: 80, status: normalized };
  if (normalized === SHIPMENT_STATUS.CANCELLED) return { score: 70, status: normalized };
  if (normalized === SHIPMENT_STATUS.SHIPPED) return { score: 60, status: normalized };

  return { score: 10, status: normalized };
}

function pickBestStatus(candidates) {
  return candidates
    .map(line => ({ line, ...scoreStatusLine(line) }))
    .filter(candidate => candidate.status)
    .sort((left, right) => right.score - left.score || left.line.length - right.line.length)[0];
}

export async function fetchTrackingStatus(trackingId, courier) {
  const sanitizedTrackingId = String(trackingId || '').trim();

  if (!sanitizedTrackingId) {
    throw new Error('tracking_id_required');
  }

  const config = getCourierConfig(courier);

  if (config.manualOnly) {
    return {
      status: SHIPMENT_STATUS.SHIPPED,
      rawStatus: 'Manual delivery route',
      trackingUrl: null,
      checkedAt: new Date().toISOString(),
      events: [],
      source: 'manual',
    };
  }

  const trackingUrl = interpolateTrackingUrl(config.trackingUrlTemplate, sanitizedTrackingId);
  if (!trackingUrl) {
    throw new Error(`tracking_url_not_configured:${config.code}`);
  }

  logger.info(`[Shipment Tracking] Fetching ${config.code} status for ${sanitizedTrackingId}`);

  const response = await axios.get(trackingUrl, {
    timeout: DEFAULT_TIMEOUT_MS,
    headers: {
      'User-Agent':
        process.env.SHIPMENT_TRACKING_USER_AGENT ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  const $ = cheerio.load(response.data);
  const candidates = extractCandidateLines($, config.selectors || ['body']);
  const bestMatch = pickBestStatus(candidates);

  if (!bestMatch) {
    throw new Error(`tracking_status_not_found:${config.code}`);
  }

  const status = normalizeShipmentStatus(bestMatch.line, SHIPMENT_STATUS.SHIPPED);
  const events = candidates
    .filter(line => line !== bestMatch.line)
    .slice(0, 5)
    .map(line => ({
      raw: line,
      normalized_status: normalizeShipmentStatus(line, status),
    }));

  return {
    status,
    rawStatus: bestMatch.line,
    trackingUrl,
    checkedAt: new Date().toISOString(),
    events,
    source: 'scrape',
  };
}
