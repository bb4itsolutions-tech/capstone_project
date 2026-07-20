import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { TrendPoint } from '../types';

interface Props {
  trend: TrendPoint[];
}

export function ActivityTrendChart({ trend }: Props) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, margin: 0, fontWeight: 600 }}>
          Activity Over Time
        </h3>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Event count &amp; average magnitude</span>
      </div>

      {trend.length < 2 ? (
        <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
          Not enough data points yet to plot a trend for this window.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={trend} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
            <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="label" stroke="var(--text-faint)" fontSize={11} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
            <YAxis
              yAxisId="count"
              stroke="var(--text-faint)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              label={{ value: 'events', angle: -90, position: 'insideLeft', fill: 'var(--text-faint)', fontSize: 11 }}
            />
            <YAxis
              yAxisId="mag"
              orientation="right"
              stroke="var(--text-faint)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 9]}
            />
            <Tooltip
              contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--text-muted)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
            <Bar yAxisId="count" dataKey="count" name="Event count" fill="var(--surface-raised)" stroke="var(--border)" radius={[3, 3, 0, 0]} />
            <Line yAxisId="mag" type="monotone" dataKey="avgMagnitude" name="Avg magnitude" stroke="var(--brand)" strokeWidth={2} dot={false} />
            <Line yAxisId="mag" type="monotone" dataKey="maxMagnitude" name="Max magnitude" stroke="var(--put)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
