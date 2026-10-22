import { getApiBaseUrl } from '../config';

export type HealthResponse = {
  status: string;
  message?: string;
  database?: 'ok' | 'unconfigured' | 'error';
  timestamp?: string;
  environment?: string;
};

/**
 * Fetches Express `/api/health` (same-origin proxy or explicit API base).
 */
export const getHealth = async (): Promise<
  { success: true; data: HealthResponse } | { success: false; error: string }
> => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/health`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Health check failed (${response.status})`,
      };
    }

    const data = (await response.json()) as HealthResponse;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Could not reach the API',
    };
  }
};
