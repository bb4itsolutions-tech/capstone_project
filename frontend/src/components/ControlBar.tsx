import type { Period, MinMagnitude } from '../types';

interface Props {
  period: Period;
  onPeriodChange: (p: Period) => void;
  minMagnitude: MinMagnitude;
  onMinMagnitudeChange: (m: MinMagnitude) => void;
  intervalSeconds: number;
  onIntervalChange: (n: number) => void;
  running: boolean;
  onToggleRunning: () => void;
  onExportCsv: () => void;
  canExport: boolean;
}

const fieldStyle: React.CSSProperties = {
  background: 'var(--surface-alt)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  padding: '8px 10px',
  fontSize: 13,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-faint)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
  display: 'block',
};

const PERIODS: { value: Period; label: string }[] = [
  { value: 'hour', label: 'Past Hour' },
  { value: 'day', label: 'Past Day' },
  { value: 'week', label: 'Past Week' },
];

const MAGNITUDES: { value: MinMagnitude; label: string }[] = [
  { value: 'all', label: 'All magnitudes' },
  { value: '1.0', label: 'M1.0+' },
  { value: '2.5', label: 'M2.5+' },
  { value: '4.5', label: 'M4.5+' },
  { value: 'significant', label: 'Significant only' },
];

export function ControlBar({
  period,
  onPeriodChange,
  minMagnitude,
  onMinMagnitudeChange,
  intervalSeconds,
  onIntervalChange,
  running,
  onToggleRunning,
  onExportCsv,
  canExport,
}: Props) {
  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 18,
        alignItems: 'flex-end',
        padding: '18px 28px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div>
        <span style={labelStyle}>Time window</span>
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                background: period === p.value ? 'var(--brand)' : 'transparent',
                color: period === p.value ? '#0b0f1f' : 'var(--text-muted)',
                fontWeight: period === p.value ? 600 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span style={labelStyle}>Minimum magnitude</span>
        <select style={fieldStyle} value={minMagnitude} onChange={(e) => onMinMagnitudeChange(e.target.value as MinMagnitude)}>
          {MAGNITUDES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span style={labelStyle}>Refresh every</span>
        <select style={fieldStyle} value={intervalSeconds} onChange={(e) => onIntervalChange(Number(e.target.value))}>
          {[30, 60, 120, 300].map((s) => (
            <option key={s} value={s}>
              {s < 60 ? `${s} sec` : `${s / 60} min`}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
        <button
          onClick={onExportCsv}
          disabled={!canExport}
          style={{
            ...fieldStyle,
            cursor: canExport ? 'pointer' : 'not-allowed',
            opacity: canExport ? 1 : 0.5,
            fontWeight: 500,
          }}
        >
          Export CSV
        </button>
        <button
          onClick={onToggleRunning}
          style={{
            padding: '9px 20px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            background: running ? 'var(--put)' : 'var(--call)',
            color: '#0b0f1f',
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
      </div>
    </section>
  );
}
