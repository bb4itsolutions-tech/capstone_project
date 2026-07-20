import type { QuakeRow } from '../types';

interface Props {
  strongest: QuakeRow | null;
}

const SCALE_MAX = 9;
const THRESHOLDS = [
  { value: 0, label: 'Minor', color: 'var(--call)' },
  { value: 4, label: 'Moderate', color: 'var(--brand)' },
  { value: 6, label: 'Strong', color: 'var(--put)' },
];

export function MagnitudeGauge({ strongest }: Props) {
  const mag = strongest?.magnitude ?? 0;
  const pct = Math.min(100, Math.max(0, (mag / SCALE_MAX) * 100));

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px 26px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, margin: 0, fontWeight: 600 }}>
          Magnitude Gauge
        </h3>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Strongest event, this window</span>
      </div>

      <div style={{ position: 'relative', height: 64 }}>
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 0,
            right: 0,
            height: 6,
            borderRadius: 3,
            background: 'linear-gradient(90deg, var(--call-dim), var(--call) 30%, var(--brand) 55%, var(--put) 80%)',
          }}
        />

        {THRESHOLDS.map((t) => (
          <div
            key={t.label}
            style={{
              position: 'absolute',
              top: 24,
              left: `${(t.value / SCALE_MAX) * 100}%`,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: 2, height: 14, background: 'var(--border)' }} />
            <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>M{t.value}+ {t.label}</div>
          </div>
        ))}

        {strongest && (
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: `${pct}%`,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', marginBottom: 2 }}>
              M{mag.toFixed(1)}
            </span>
            <div style={{ width: 2, height: 20, background: 'var(--brand)' }} />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: 'var(--brand)',
                marginTop: -1,
                boxShadow: '0 0 10px rgba(242,169,59,0.7)',
              }}
            />
          </div>
        )}
      </div>

      {strongest ? (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '10px 0 0' }}>
          {strongest.place} · {strongest.depthKm.toFixed(1)} km deep
          {strongest.tsunami ? ' · Tsunami criteria flagged' : ''}
        </p>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: '10px 0 0' }}>No events in this window.</p>
      )}
    </div>
  );
}
