import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ConventionOptions } from '@/model/convention-responses';

/**
 * Loads domains, topics and repo roles for dropdowns.
 */
export const getConventionOptions = async (apiBaseUrl?: string): Promise<ApiResponse<ConventionOptions>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/options`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getConventionOptions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
