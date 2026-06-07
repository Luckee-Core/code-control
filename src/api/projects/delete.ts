import { ApiResponse } from '../types';

export const deleteProject = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<void>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const url = `${baseUrl}/api/data/projects/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting customer project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
