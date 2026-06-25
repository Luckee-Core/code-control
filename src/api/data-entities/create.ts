import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { DataEntity } from '@/model/data-entity';

export type CreateDataEntityInput = {
  project_id: string;
  name: string;
  table_name?: string | null;
  sort_order?: number;
};

export const createDataEntity = async (
  input: CreateDataEntityInput,
  apiBaseUrl?: string
): Promise<ApiResponse<DataEntity>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/data-entities`, {
      method: 'POST',
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
    console.error('Error creating data entity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
