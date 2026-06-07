/**
 * Code Control API base URL (Express server).
 */
const DEFAULT_API_URL = 'http://localhost:3010';

export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL ?? DEFAULT_API_URL;
};
