// usgsClient.js
//
// The USGS Earthquake Hazards Program publishes plain, static, cache-friendly
// GeoJSON feeds intended for exactly this kind of polling — no API key, no
// cookies, no bot-fingerprint gating, and Access-Control-Allow-Origin: * on
// every endpoint. We still route it through this small backend (rather than
// having the frontend hit USGS directly) so we can: validate inputs against
// a whitelist, cache briefly to be a polite/efficient consumer of a shared
// public feed, and compute analytics server-side once instead of duplicating
// that logic in the browser.

const BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

const VALID_PERIODS = ['hour', 'day', 'week'];
const VALID_THRESHOLDS = ['all', '1.0', '2.5', '4.5', 'significant'];

const REQUEST_TIMEOUT_MS = Number(process.env.USGS_TIMEOUT_MS || 8000);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 30000); // USGS feeds refresh ~1/min; be a polite consumer

/** @type {Map<string, { data: any, at: number }>} */
const cache = new Map();

async function safeFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'nse-analytics-dashboard-capstone/1.0 (student project)' },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`USGS request failed (${res.status}) for ${url}: ${body.slice(0, 200)}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Timed out after ${REQUEST_TIMEOUT_MS}ms reaching ${url}`);
    }
    const code = err.cause?.code || err.cause?.message || err.message;
    throw new Error(`Could not reach ${url} (${code}). Check outbound internet access on this machine.`);
  } finally {
    clearTimeout(timer);
  }
}

export function isValidPeriod(period) {
  return VALID_PERIODS.includes(period);
}

export function isValidThreshold(threshold) {
  return VALID_THRESHOLDS.includes(threshold);
}

export async function fetchFeed(threshold, period) {
  if (!isValidThreshold(threshold)) throw new Error(`Invalid magnitude threshold: ${threshold}`);
  if (!isValidPeriod(period)) throw new Error(`Invalid period: ${period}`);

  const key = `${threshold}_${period}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data;

  const data = await safeFetch(`${BASE}/${key}.geojson`);
  cache.set(key, { data, at: Date.now() });
  return data;
}
