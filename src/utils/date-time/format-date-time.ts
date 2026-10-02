import { DateTime } from 'luxon';
import { EST_TIMEZONE } from './constants';

/**
 * Formats a date to a short date string in EST (e.g., "Jan 23, 2026")
 */
export const formatDateTime = (date: Date | string): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const estDate = dt.setZone(EST_TIMEZONE);

  if (!estDate.isValid) {
    return '—';
  }

  return estDate.toLocaleString({
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
