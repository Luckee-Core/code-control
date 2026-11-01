import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { SoftwareSystem } from '@/model/software-system';

export const getSoftwareSystemById = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<SoftwareSystem>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/software-systems/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Customer project not found' };
      }
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching customer project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
