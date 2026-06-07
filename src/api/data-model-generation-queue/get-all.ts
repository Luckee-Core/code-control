import { ApiResponse } from '../types';
import { DataModelGenerationQueue } from '@/model/data-model-generation-queue';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const getAllDataModelQueue = async (
  apiBaseUrl?: string
): Promise<ApiResponse<DataModelGenerationQueue[]>> => {
  const baseUrl = apiBaseUrl || BASE_URL;
  
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
