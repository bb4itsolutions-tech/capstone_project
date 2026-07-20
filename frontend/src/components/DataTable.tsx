import { useMemo, useState } from 'react';
import type { QuakeRow, Severity } from '../types';
import { classifySeverityColor, classifySeverityLabel, severityOf } from '../severity';

interface Props {
  rows: QuakeRow[];
}

export function DataTable({ rows }: Props) {
  const [filter, setFilter] = useState<Severity | 'all'>('all');

  const visible = useMemo(() => {
    if (filter === 'all') return rows;
    return rows.filter((r) => severityOf(r.magnitude) === filter);
  }, [rows, filter]);

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, margin: 0, fontWeight: 600 }}>
          Recent Events ({visible.length})
        </h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'minor', 'moderate', 'strong'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 11,
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                background: filter === f ? 'var(--surface-raised)' : 'transparent',
                color: filter === f ? 'var(--text)' : 'var(--text-muted)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: 420, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ position: 'sticky', top: 0, background: 'var(--surface)' }}>
              <Th align="left">Time</Th>
              <Th align="left">Location</Th>
              <Th align="center">Mag</Th>
              <Th align="right">Depth (km)</Th>
              <Th align="center">Tsunami</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <Td align="left" className="mono">
                  {new Date(r.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Td>
                <Td align="left">{r.place}</Td>
                <Td align="center">
                  <span
                    className="mono"
                    style={{
                      fontWeight: 700,
                      color: classifySeverityColor(r.magnitude),
                    }}
                    title={classifySeverityLabel(r.magnitude)}
                  >
                    {r.magnitude.toFixed(1)}
                  </span>
                </Td>
                <Td align="right" className="mono">
                  {r.depthKm.toFixed(1)}
                </Td>
                <Td align="center">{r.tsunami ? '⚠️' : '—'}</Td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-faint)' }}>
                  No events match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align: 'left' | 'right' | 'center' }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: '8px 10px',
        fontWeight: 600,
        fontSize: 11,
        color: 'var(--text-faint)',
        borderBottom: '1px solid var(--border)',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  className,
}: {
  children: React.ReactNode;
  align: 'left' | 'right' | 'center';
  className?: string;
}) {
  return (
    <td
      className={className}
      style={{
        textAlign: align,
        padding: '7px 10px',
        color: 'var(--text)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      {children}
    </td>
  );
}
