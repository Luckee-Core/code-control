/**
 * Safe short display for optional UUIDs.
 */
export const truncateId = (id: string | null | undefined, length = 8): string => {
  if (!id) return '—';
  if (id.length <= length) return id;
  return `${id.slice(0, length)}…`;
};
