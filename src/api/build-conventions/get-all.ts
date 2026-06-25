import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { BuildConvention } from '@/model/build-convention';

export const getAllBuildConventions = async (
  apiBaseUrl?: string
): Promise<ApiResponse<BuildConvention[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/build-conventions`, {
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
    console.error('Error fetching build conventions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
