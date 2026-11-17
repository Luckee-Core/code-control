/** Format an estimated USD cost for display (city-nonprofits pattern). */
export const formatEstimatedCostUsd = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return '—';
  if (value === 0) return '$0.00';
  if (value < 0.01) return '<$0.01';
  return `$${value.toFixed(4)}`;
};
