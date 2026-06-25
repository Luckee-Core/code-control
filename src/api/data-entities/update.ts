import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { DataEntity } from '@/model/data-entity';

export type UpdateDataEntityInput = {
  name?: string;
  table_name?: string | null;
  sort_order?: number;
  assigned_repo_ids?: string[];
};

export const updateDataEntity = async (
  id: string,
  input: UpdateDataEntityInput,
  apiBaseUrl?: string
): Promise<ApiResponse<DataEntity>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/data-entities/${id}`, {
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
    console.error('Error updating data entity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
