import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { BuildConvention } from '@/model/build-convention';

export type UpdateBuildConventionInput = {
  name?: string;
  stack?: string;
  content?: string;
  tags?: string[];
};

export const updateBuildConvention = async (
  id: string,
  input: UpdateBuildConventionInput,
  apiBaseUrl?: string
): Promise<ApiResponse<BuildConvention>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/build-conventions/${id}`, {
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
    console.error('Error updating build convention:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
