import type { Period, MinMagnitude, QuakesResponse } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

export async function fetchQuakes(period: Period, minMagnitude: MinMagnitude): Promise<QuakesResponse> {
  const params = new URLSearchParams({ period, minMagnitude });
  const res = await fetch(`${API_BASE}/api/quakes?${params.toString()}`);
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body as QuakesResponse;
}
