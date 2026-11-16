import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { Convention, UpdateConventionInput } from '@/model/convention';

/**
 * Updates a convention.
 */
export const updateConvention = async (id: string, input: UpdateConventionInput, apiBaseUrl?: string): Promise<ApiResponse<Convention>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
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
    console.error('Error in updateConvention:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
