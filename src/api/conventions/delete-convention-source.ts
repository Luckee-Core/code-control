import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';

/**
 * Deletes a convention source.
 */
export const deleteConventionSource = async (sourceId: string, apiBaseUrl?: string): Promise<ApiResponse<{ deleted: boolean }>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/sources/${sourceId}`, {
      method: 'DELETE',
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
    console.error('Error in deleteConventionSource:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
