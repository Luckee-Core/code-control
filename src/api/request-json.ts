import { getApiBaseUrl } from './config';
import type { ApiResponse } from './types';

type RequestJsonOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
};

/**
 * Calls the Code Control Express API and returns its `{ success, data, error }` envelope.
 * Network and HTTP failures become `{ success: false, error }`; never throws.
 */
export const requestJson = async <T>(
  path: string,
  options: RequestJsonOptions = {},
): Promise<ApiResponse<T>> => {
  const url = `${getApiBaseUrl()}${path}`;
  try {
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    const json = (await response.json().catch(() => ({}))) as ApiResponse<T>;
    if (!response.ok || json.success === false) {
      return {
        success: false,
        error: json.error || json.message || `HTTP error! status: ${response.status}`,
      };
    }
    return json;
  } catch (error) {
    console.error(`❌ ${options.method ?? 'GET'} ${path} failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
