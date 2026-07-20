import { useState } from 'react';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { SummaryCards } from './components/SummaryCards';
import { MagnitudeGauge } from './components/MagnitudeGauge';
import { SeverityDonut } from './components/SeverityDonut';
import { ActivityTrendChart } from './components/ActivityTrendChart';
import { DataTable } from './components/DataTable';
import { StatusBanner } from './components/StatusBanner';
import { LoadingState } from './components/LoadingState';
import { useQuakeFeed } from './hooks/useQuakeFeed';
import type { Period, MinMagnitude } from './types';

export default function App() {
  const [period, setPeriod] = useState<Period>('day');
  const [minMagnitude, setMinMagnitude] = useState<MinMagnitude>('2.5');
  const [intervalSeconds, setIntervalSeconds] = useState(60);
  const [running, setRunning] = useState(true);

  const { data, loading, error, refetch } = useQuakeFeed({ period, minMagnitude, intervalSeconds, running });

  function handleExportCsv() {
    if (!data) return;
    const headers = ['Time', 'Place', 'Magnitude', 'Depth (km)', 'Tsunami', 'Alert', 'Significance'];
    const lines = data.analytics.rows.map((r) =>
      [
        new Date(r.time).toISOString(),
        `"${r.place.replace(/"/g, '""')}"`,
        r.magnitude,
        r.depthKm,
        r.tsunami ? 'Yes' : 'No',
        r.alert ?? '',
        r.significance,
      ].join(',')
    );
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Seismic-Live-${period}-${minMagnitude}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header
        connected={running && !error}
        eventCount={data?.analytics.count ?? null}
        lastUpdated={data ? new Date(data.fetchedAt).toLocaleTimeString() : null}
      />

      <ControlBar
        period={period}
        onPeriodChange={setPeriod}
        minMagnitude={minMagnitude}
        onMinMagnitudeChange={setMinMagnitude}
        intervalSeconds={intervalSeconds}
        onIntervalChange={setIntervalSeconds}
        running={running}
        onToggleRunning={() => setRunning((r) => !r)}
        onExportCsv={handleExportCsv}
        canExport={!!data && data.analytics.count > 0}
      />

      <main
        style={{
          flex: 1,
          padding: '24px 28px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxWidth: 1400,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {error && (
          <StatusBanner
            message="We couldn't refresh the latest earthquake data. We'll keep trying — or you can retry now."
            onRetry={refetch}
          />
        )}

        {!data && loading ? (
          <LoadingState label="Fetching live earthquake data…" />
        ) : !data ? (
          <LoadingState label="Starting up…" />
        ) : (
          <>
            <SummaryCards analytics={data.analytics} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 18 }} className="responsive-grid">
              <MagnitudeGauge strongest={data.analytics.strongest} />
              <SeverityDonut analytics={data.analytics} />
            </div>

            <ActivityTrendChart trend={data.trend} />

            <DataTable rows={data.analytics.rows} />
          </>
        )}
      </main>

      <style>{`
        @media (max-width: 860px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
