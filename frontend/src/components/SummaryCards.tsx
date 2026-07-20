import type { Analytics } from '../types';

interface Props {
  analytics: Analytics;
}

export function SummaryCards({ analytics }: Props) {
  const strongest = analytics.strongest;

  const cards = [
    {
      label: 'Total Events',
      value: analytics.count.toLocaleString(),
      valueColor: 'var(--text)',
      note: 'Recorded in the selected window',
    },
    {
      label: 'Strongest Event',
      value: strongest ? `M${strongest.magnitude.toFixed(1)}` : '—',
      valueColor: strongest && strongest.magnitude >= 6 ? 'var(--put)' : strongest && strongest.magnitude >= 4 ? 'var(--brand)' : 'var(--call)',
      note: strongest ? strongest.place : 'No events in range',
    },
    {
      label: 'Average Magnitude',
      value: analytics.averageMagnitude.toFixed(1),
      valueColor: 'var(--text)',
      note: `Average depth ${analytics.averageDepth.toFixed(1)} km`,
    },
    {
      label: 'Tsunami Flags',
      value: analytics.tsunamiCount.toString(),
      valueColor: analytics.tsunamiCount > 0 ? 'var(--put)' : 'var(--text-muted)',
      note: `${analytics.significantCount} classified as significant`,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px 18px',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {c.label}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: c.valueColor,
              marginTop: 6,
            }}
          >
            {c.value}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.note}
          </div>
        </div>
      ))}
    </div>
  );
}
