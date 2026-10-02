import { DateTime } from 'luxon';
import { EST_TIMEZONE } from './constants';

/**
 * Formats a date for display in EST
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string (MM/DD/YYYY) in EST
 * @example
 * formatDate(new Date()) // "01/15/2024"
 * formatDate('2024-01-15T00:00:00Z') // "01/14/2024" (if that's the EST date)
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '—';
  
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  const estDate = dt.setZone(EST_TIMEZONE);
  
  if (!estDate.isValid) {
    return '—';
  }
  
  const month = String(estDate.month).padStart(2, '0');
  const day = String(estDate.day).padStart(2, '0');
  const year = estDate.year;
  
  return `${month}/${day}/${year}`;
};
