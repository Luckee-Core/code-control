import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { DataModelGenerationQueue } from '@/model/data-model-generation-queue';


export const getAllDataModelQueue = async (
  apiBaseUrl?: string
): Promise<ApiResponse<DataModelGenerationQueue[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  
  const response = await fetch(`${baseUrl}/api/data/data-model-generation-queue`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch data model queue' };
  }

  const result = await response.json();
  return { success: true, data: result.data };
};
