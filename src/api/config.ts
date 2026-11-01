/**
 * Code Control API base URL (Express server).
 * Empty string = same-origin `/api/*` proxied by Next.js rewrites in next.config.ts.
 */
export const getApiBaseUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  return '';
};

export const getCrmProxyUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/api/crm${normalized}`;
};
