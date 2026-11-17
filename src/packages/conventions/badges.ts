import type { ConventionSeverity, ConventionStatus } from '@/model/convention';

/** Tailwind classes for convention severity pills (shared by list and detail pages). */
export const SEVERITY_BADGE: Record<ConventionSeverity, string> = {
  must: 'bg-red-50 text-red-700 border-red-200',
  never: 'bg-red-50 text-red-700 border-red-200',
  should: 'bg-amber-50 text-amber-800 border-amber-200',
  avoid: 'bg-amber-50 text-amber-800 border-amber-200',
};

/** Tailwind classes for convention status pills. */
export const STATUS_BADGE: Record<ConventionStatus, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  draft: 'bg-gray-50 text-gray-700 border-gray-300',
  deprecated: 'bg-gray-100 text-gray-500 border-gray-300 line-through',
};

export const badgeBase = `
  inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide
`;
