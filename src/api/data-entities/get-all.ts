import { ApiResponse } from '../types';
import { DataEntityWithFields } from '@/model';

export const getAllDataEntities = async (
  apiBaseUrl: string
): Promise<ApiResponse<DataEntityWithFields[]>> => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/data/data-entities`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to fetch data entities' };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error fetching all data entities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
