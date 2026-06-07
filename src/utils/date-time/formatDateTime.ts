import { DateTime } from 'luxon';
import { EST_TIMEZONE } from './constants';

/**
 * Formats a date to a short date string in EST (e.g., "Jan 23, 2026")
 * @param date - Date object or string to format
 * @returns Formatted date string in "MMM DD, YYYY" format (EST)
 * @example
 * formatDateTime(new Date()) // "Jan 23, 2026"
 * formatDateTime('2026-01-23T15:45:00Z') // "Jan 23, 2026" (in EST)
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

/**
 * Formats a date and time string in EST (e.g., "Jan 23, 2026, 3:45 PM EST")
 * @param date - Date object or string to format
 * @returns Formatted date and time string in EST
 * @example
 * formatDateTimeWithTime(new Date()) // "Jan 23, 2026, 3:45 PM EST"
 * formatDateTimeWithTime('2026-01-23T15:45:00Z') // "Jan 23, 2026, 10:45 AM EST"
 */
export const formatDateTimeWithTime = (date: Date | string | undefined): string => {
  if (!date) return '—';
  
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const estDate = dt.setZone(EST_TIMEZONE);
  
  if (!estDate.isValid) {
    return '—';
  }
  
  // Format: "Jan 27, 2026, 2:36 PM EST"
  return estDate.toLocaleString({
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) + ' EST';
};
