import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { SoftwareSystemRepo } from '@/model/software-system-repo';

export const getReposBySoftwareSystemId = async (
  softwareSystemId: string,
  apiBaseUrl?: string,
): Promise<ApiResponse<SoftwareSystemRepo[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/software-systems/${softwareSystemId}/software-system-setup/repos`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
    console.error('Error fetching software system repos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
