// analytics.js
//
// Computes the summary stats, severity breakdown, and time-bucketed trend
// used by the dashboard, from a USGS GeoJSON FeatureCollection of quake
// events. Kept dependency-free and pure so it's easy to unit test.

function round1(n) {
  const r = Math.round(n * 10) / 10;
  return Object.is(r, -0) ? 0 : r;
}

const SEVERITY_BANDS = {
  minor: (mag) => mag < 4,
  moderate: (mag) => mag >= 4 && mag < 6,
  strong: (mag) => mag >= 6,
};

export function classifySeverity(mag) {
  if (SEVERITY_BANDS.strong(mag)) return 'strong';
  if (SEVERITY_BANDS.moderate(mag)) return 'moderate';
  return 'minor';
}

export function toRow(feature) {
  const p = feature.properties;
  const [lon, lat, depth] = feature.geometry?.coordinates || [null, null, null];
  return {
    id: feature.id,
    time: p.time,
    place: p.place || 'Unknown location',
    magnitude: p.mag ?? 0,
    magType: p.magType || '',
    depthKm: depth ?? 0,
    lat,
    lon,
    tsunami: !!p.tsunami,
    alert: p.alert || null,
    felt: p.felt ?? null,
    significance: p.sig ?? 0,
    url: p.url,
  };
}

/**
 * @param {Array} features  Raw features from the USGS GeoJSON FeatureCollection
 */
export function computeAnalytics(features) {
  const rows = features.map(toRow).sort((a, b) => b.time - a.time);

  if (!rows.length) {
    return {
      count: 0,
      strongest: null,
      averageMagnitude: 0,
      averageDepth: 0,
      tsunamiCount: 0,
      significantCount: 0,
      severity: { minor: 0, moderate: 0, strong: 0 },
      rows: [],
    };
  }

  let magSum = 0;
  let depthSum = 0;
  let tsunamiCount = 0;
  let significantCount = 0;
  const severity = { minor: 0, moderate: 0, strong: 0 };
  let strongest = rows[0];

  for (const r of rows) {
    magSum += r.magnitude;
    depthSum += r.depthKm;
    if (r.tsunami) tsunamiCount++;
    if (r.significance >= 600) significantCount++;
    severity[classifySeverity(r.magnitude)]++;
    if (r.magnitude > strongest.magnitude) strongest = r;
  }

  return {
    count: rows.length,
    strongest,
    averageMagnitude: round1(magSum / rows.length),
    averageDepth: round1(depthSum / rows.length),
    tsunamiCount,
    significantCount,
    severity,
    rows,
  };
}

/**
 * Buckets events into time windows for the trend chart.
 * @param {Array} rows  Output of computeAnalytics(...).rows
 * @param {number} bucketMinutes
 */
export function buildTrend(rows, bucketMinutes) {
  const bucketMs = bucketMinutes * 60000;
  const buckets = new Map();

  for (const r of rows) {
    const bucketStart = Math.floor(r.time / bucketMs) * bucketMs;
    const b = buckets.get(bucketStart) || { time: bucketStart, count: 0, magSum: 0, maxMag: 0 };
    b.count += 1;
    b.magSum += r.magnitude;
    b.maxMag = Math.max(b.maxMag, r.magnitude);
    buckets.set(bucketStart, b);
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.time - b.time)
    .map((b) => ({
      time: b.time,
      label: new Date(b.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count: b.count,
      avgMagnitude: round1(b.magSum / b.count),
      maxMagnitude: round1(b.maxMag),
    }));
}
