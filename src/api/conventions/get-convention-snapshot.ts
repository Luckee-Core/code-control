import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ConventionSnapshot } from '@/model/convention-snapshot';

/**
 * Loads one saved snapshot.
 */
export const getConventionSnapshot = async (id: string, apiBaseUrl?: string): Promise<ApiResponse<ConventionSnapshot>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/snapshots/${id}`, {
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
    console.error('Error in getConventionSnapshot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
