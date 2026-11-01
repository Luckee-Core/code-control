import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { SoftwareSystem } from '@/model/software-system';

/**
 * Get projects by customer ID.
 */
export const getSoftwareSystemsByCustomerId = async (
  customerId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<SoftwareSystem[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/software-systems/customer/${customerId}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
