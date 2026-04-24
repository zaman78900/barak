import logger from '../utils/logger.js';
import { checkAllShipments } from './shipmentService.js';

let schedulerHandle = null;
let running = false;

async function runShipmentCheck(trigger = 'scheduler') {
  if (running) {
    logger.info(`[Shipment Scheduler] Skipping ${trigger} run because another cycle is active`);
    return { skipped: true, reason: 'already_running' };
  }

  running = true;

  try {
    logger.info(`[Shipment Scheduler] Starting shipment sync via ${trigger}`);
    const summary = await checkAllShipments();
    logger.info(
      `[Shipment Scheduler] Completed shipment sync via ${trigger} | checked=${summary.checked} updated=${summary.updated} failed=${summary.failed}`
    );
    return summary;
  } finally {
    running = false;
  }
}

export function startShipmentScheduler() {
  const enabled = String(process.env.SHIPMENT_AUTOMATION_ENABLED || 'true').toLowerCase() !== 'false';
  const intervalMinutes = Number(process.env.SHIPMENT_CHECK_INTERVAL_MINUTES || 30);

  if (!enabled) {
    logger.info('[Shipment Scheduler] Disabled by SHIPMENT_AUTOMATION_ENABLED=false');
    return null;
  }

  if (schedulerHandle) {
    return schedulerHandle;
  }

  const intervalMs = Math.max(intervalMinutes, 5) * 60 * 1000;

  schedulerHandle = setInterval(() => {
    runShipmentCheck('interval').catch(error => {
      logger.error(`[Shipment Scheduler] Interval run failed: ${error.message}`);
    });
  }, intervalMs);

  logger.info(`[Shipment Scheduler] Started with ${Math.round(intervalMs / 60000)} minute interval`);

  if (String(process.env.SHIPMENT_RUN_ON_BOOT || 'true').toLowerCase() !== 'false') {
    runShipmentCheck('boot').catch(error => {
      logger.error(`[Shipment Scheduler] Boot run failed: ${error.message}`);
    });
  }

  return schedulerHandle;
}

export function stopShipmentScheduler() {
  if (schedulerHandle) {
    clearInterval(schedulerHandle);
    schedulerHandle = null;
  }
}

export async function triggerShipmentCheck(trigger = 'manual') {
  return runShipmentCheck(trigger);
}
