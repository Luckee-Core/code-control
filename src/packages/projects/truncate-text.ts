export const truncateText = (text: string | null, max: number): string => {
  if (!text) return '—';
  if (text.length <= max) return text;
  return text.slice(0, max) + '…';
};
