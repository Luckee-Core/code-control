import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';

export const deleteBuildConvention = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<void>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/build-conventions/${id}`, {
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
    console.error('Error deleting build convention:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
