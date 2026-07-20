import type { Severity } from './types';

export function severityOf(mag: number): Severity {
  if (mag >= 6) return 'strong';
  if (mag >= 4) return 'moderate';
  return 'minor';
}

export function classifySeverityColor(mag: number): string {
  const s = severityOf(mag);
  if (s === 'strong') return 'var(--put)';
  if (s === 'moderate') return 'var(--brand)';
  return 'var(--call)';
}

export function classifySeverityLabel(mag: number): string {
  const s = severityOf(mag);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
