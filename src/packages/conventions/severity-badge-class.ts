import type { ConventionSeverity, ConventionStatus } from '@/model/convention';

const base = 'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide';

/**
 * Tailwind classes for a severity or status badge.
 */
export const severityBadgeClass = (value: ConventionSeverity | ConventionStatus): string => {
  switch (value) {
    case 'must':
    case 'never':
      return `${base} bg-red-50 text-red-700`;
    case 'should':
    case 'avoid':
      return `${base} bg-amber-50 text-amber-700`;
    case 'active':
      return `${base} bg-green-50 text-green-700`;
    case 'deprecated':
      return `${base} bg-gray-100 text-gray-500`;
    default:
      return `${base} bg-blue-50 text-blue-700`;
  }
};
