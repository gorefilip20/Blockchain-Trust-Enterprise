/**
 * Standalone verification worker — run with: npx tsx scripts/verify-worker.ts
 * Polls every 30 seconds for pending crypto payments and verifies them on-chain.
 */
import { processPendingPayments } from '../src/lib/verify-payments';

const POLL_INTERVAL_MS = 30_000;

async function tick() {
  try {
    const results = await processPendingPayments();
    if (results.processed > 0) {
      console.log(
        `[${new Date().toISOString()}] Processed: ${results.processed}, Verified: ${results.verified}, Failed: ${results.failed}`
      );
      if (results.errors.length > 0) {
        results.errors.forEach((e) => console.error('  -', e));
      }
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Worker error:`, (err as Error).message);
  }
}

console.log(`[verify-worker] Starting multi-chain payment verification loop (${POLL_INTERVAL_MS / 1000}s interval)`);
tick();
setInterval(tick, POLL_INTERVAL_MS);
