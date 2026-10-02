import { DateTime } from 'luxon';
import { EST_TIMEZONE } from './constants';

/**
 * Formats a date and time string in EST (e.g., "Jan 23, 2026, 3:45 PM EST")
 */
export const formatDateTimeWithTime = (date: Date | string | undefined): string => {
  if (!date) return '—';

  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const estDate = dt.setZone(EST_TIMEZONE);

  if (!estDate.isValid) {
    return '—';
  }

  return (
    estDate.toLocaleString({
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' EST'
  );
};
