import { ApiResponse } from '../types';
import type { DataEntityWithFields } from '@/model/data-entity';

export const getDataEntitiesByProjectId = async (
  projectId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<DataEntityWithFields[]>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const response = await fetch(
      `${baseUrl}/api/data/data-entities?project_id=${encodeURIComponent(projectId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data entities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
