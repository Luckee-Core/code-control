import { DateTime } from 'luxon';

/**
 * Formats a timestamp relative to now (e.g., "3 minutes ago", "2 days ago").
 */
export const formatTimeAgo = (date: string | undefined): string => {
  if (!date) return '—';
  const dt = DateTime.fromISO(date);
  if (!dt.isValid) return '—';
  return dt.toRelative() ?? '—';
};
