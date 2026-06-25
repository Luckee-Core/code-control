import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { BuildExample } from '@/model/build-example';

export type UpdateBuildExampleInput = {
  name?: string;
  tags?: string[];
  language?: string;
  code?: string;
};

export const updateBuildExample = async (
  id: string,
  input: UpdateBuildExampleInput,
  apiBaseUrl?: string
): Promise<ApiResponse<BuildExample>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/build-examples/${id}`, {
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
    console.error('Error updating build example:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
