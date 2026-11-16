import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ConventionDetail } from '@/model/convention-responses';

/**
 * Loads a convention with roles, examples and sources.
 */
export const getConventionDetail = async (id: string, apiBaseUrl?: string): Promise<ApiResponse<ConventionDetail>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/${id}`, {
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
    console.error('Error in getConventionDetail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
