interface Props {
  connected: boolean;
  eventCount: number | null;
  lastUpdated: string | null;
}

export function Header({ connected, eventCount, lastUpdated }: Props) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px',
        borderBottom: '1px solid var(--border-soft)',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Seismic<span style={{ color: 'var(--brand)' }}>.</span>Live
        </h1>
        <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>Global Earthquake Analytics — USGS</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        {eventCount !== null && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Events
            </div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>
              {eventCount.toLocaleString()}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: connected ? 'var(--call)' : 'var(--text-faint)',
              animation: connected ? 'pulse 1.8s infinite' : 'none',
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {connected ? `Live · updated ${lastUpdated ?? ''}` : 'Idle'}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(61,220,151,0.55); }
          70% { box-shadow: 0 0 0 8px rgba(61,220,151,0); }
          100% { box-shadow: 0 0 0 0 rgba(61,220,151,0); }
        }
      `}</style>
    </header>
  );
}
