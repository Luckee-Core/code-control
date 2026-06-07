import { ApiResponse } from '../types';

export const deleteBuildConvention = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<void>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
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
