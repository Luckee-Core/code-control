import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';

export const deleteDataEntity = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<null>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/data-entities/${id}`, {
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
    return { success: true, data: null };
  } catch (error) {
    console.error('Error deleting data entity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
