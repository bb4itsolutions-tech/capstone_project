import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Analytics } from '../types';

interface Props {
  analytics: Analytics;
}

export function SeverityDonut({ analytics }: Props) {
  const { severity, count } = analytics;

  const data = [
    { name: 'Minor (< M4)', value: severity.minor, color: 'var(--call)' },
    { name: 'Moderate (M4–6)', value: severity.moderate, color: 'var(--brand)' },
    { name: 'Strong (M6+)', value: severity.strong, color: 'var(--put)' },
  ].filter((d) => d.value > 0);

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, margin: '0 0 10px', fontWeight: 600 }}>
        Severity Breakdown
      </h3>
      {count === 0 ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
          No events in this window.
        </div>
      ) : (
        <div style={{ position: 'relative', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} stroke="none" paddingAngle={2}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => `${v} event${v === 1 ? '' : 's'}`}
                contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <div className="mono" style={{ fontSize: 24, fontWeight: 700 }}>
              {count}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>events</div>
          </div>
        </div>
      )}
    </div>
  );
}
