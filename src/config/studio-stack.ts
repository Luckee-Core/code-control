import { getApiBaseUrl } from '@/api/config';

/** Default Code Control Express port when run from Luckee Hub. */
export const DEFAULT_EXPRESS_PORT = 3012;

/** Default storage Express port (Hub). */
export const DEFAULT_STORAGE_PORT = 3080;

/** Default web port (Hub). */
export const DEFAULT_WEB_PORT = 3013;

/**
 * Express base URL shown in setup copy (explicit env or Hub default).
 */
export const getDefaultExpressBaseUrl = (): string => {
  const base = getApiBaseUrl();
  if (base) {
    return base;
  }
  return `http://127.0.0.1:${DEFAULT_EXPRESS_PORT}`;
};

export const getExpressHealthCurlExample = (): string =>
  `curl -s ${getDefaultExpressBaseUrl()}/api/health`;

export const STORAGE_REPO_NAME = 'code-generator-storage-server';
export const EXPRESS_REPO_NAME = 'code-control-express-server';
export const WEB_REPO_NAME = 'code-control';
