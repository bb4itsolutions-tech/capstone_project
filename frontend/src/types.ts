export type Period = 'hour' | 'day' | 'week';
export type MinMagnitude = 'all' | '1.0' | '2.5' | '4.5' | 'significant';
export type Severity = 'minor' | 'moderate' | 'strong';
export type AlertLevel = 'green' | 'yellow' | 'orange' | 'red' | null;

export interface QuakeRow {
  id: string;
  time: number;
  place: string;
  magnitude: number;
  magType: string;
  depthKm: number;
  lat: number | null;
  lon: number | null;
  tsunami: boolean;
  alert: AlertLevel;
  felt: number | null;
  significance: number;
  url?: string;
}

export interface Analytics {
  count: number;
  strongest: QuakeRow | null;
  averageMagnitude: number;
  averageDepth: number;
  tsunamiCount: number;
  significantCount: number;
  severity: { minor: number; moderate: number; strong: number };
  rows: QuakeRow[];
}

export interface TrendPoint {
  time: number;
  label: string;
  count: number;
  avgMagnitude: number;
  maxMagnitude: number;
}

export interface QuakesResponse {
  fetchedAt: string;
  feedGeneratedAt: number | null;
  period: Period;
  minMagnitude: MinMagnitude;
  analytics: Analytics;
  trend: TrendPoint[];
}
