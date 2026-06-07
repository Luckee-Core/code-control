import { ApiResponse } from '../types';

export const deleteDataEntityField = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<null>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const response = await fetch(`${baseUrl}/api/data/data-entity-fields/${id}`, {
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
    console.error('Error deleting data entity field:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
