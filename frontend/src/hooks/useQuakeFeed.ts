import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchQuakes } from '../api';
import type { Period, MinMagnitude, QuakesResponse } from '../types';

interface Params {
  period: Period;
  minMagnitude: MinMagnitude;
  intervalSeconds: number;
  running: boolean;
}

interface State {
  data: QuakesResponse | null;
  loading: boolean;
  error: string | null;
}

export function useQuakeFeed({ period, minMagnitude, intervalSeconds, running }: Params) {
  const [state, setState] = useState<State>({ data: null, loading: false, error: null });
  const timerRef = useRef<number | null>(null);

  const poll = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await fetchQuakes(period, minMagnitude);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: (err as Error).message }));
    }
  }, [period, minMagnitude]);

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (!running) return;

    poll();
    timerRef.current = window.setInterval(poll, Math.max(10, intervalSeconds) * 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running, poll, intervalSeconds]);

  return { ...state, refetch: poll };
}
