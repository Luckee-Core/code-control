import { getApiBaseUrl } from '../config';

export type HealthResponse = {
  status: string;
  message?: string;
  canonicalData?: 'ok' | 'unconfigured' | 'error';
  /** Legacy alias in older UI copy */
  storage?: 'ok' | 'unconfigured' | 'error';
  storageUrl?: string | null;
  directUrl?: string | null;
  gatewayUrl?: string | null;
  database?: 'ok' | 'unconfigured' | 'error';
  canonicalDataDetail?: string | null;
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
    console.log('📥 [health.getHealth] GET', url);
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
    console.log('📤 [health.getHealth] OK', {
      status: data.status,
      canonicalData: data.canonicalData,
      database: data.database,
    });
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not reach the API';
    console.error('❌ [health.getHealth] Failed:', message);
    return {
      success: false,
      error: message,
    };
  }
};
