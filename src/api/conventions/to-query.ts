/**
 * Builds a query string from defined, non-empty filter values.
 */
export const toQuery = (filter: Record<string, string | undefined>): string => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : '';
};
