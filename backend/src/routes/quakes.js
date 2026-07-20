import { Router } from 'express';
import { fetchFeed, isValidPeriod, isValidThreshold } from '../usgsClient.js';
import { computeAnalytics, buildTrend } from '../analytics.js';

export const router = Router();

const TREND_BUCKET_MINUTES = {
  hour: 5,
  day: 60,
  week: 360,
};

router.get('/quakes', async (req, res) => {
  const period = req.query.period || 'day';
  const threshold = req.query.minMagnitude || 'all';

  if (!isValidPeriod(period)) {
    return res.status(400).json({ error: `period must be one of: hour, day, week` });
  }
  if (!isValidThreshold(threshold)) {
    return res.status(400).json({ error: `minMagnitude must be one of: all, 1.0, 2.5, 4.5, significant` });
  }

  try {
    const geojson = await fetchFeed(threshold, period);
    const features = geojson.features || [];
    const analytics = computeAnalytics(features);
    const trend = buildTrend(analytics.rows, TREND_BUCKET_MINUTES[period]);

    res.json({
      fetchedAt: new Date().toISOString(),
      feedGeneratedAt: geojson.metadata?.generated ?? null,
      period,
      minMagnitude: threshold,
      analytics,
      trend,
    });
  } catch (err) {
    console.error('[GET /api/quakes]', err.message);
    res.status(502).json({ error: err.message });
  }
});
