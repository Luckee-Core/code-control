import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { SoftwareSystem } from '@/model/software-system';

export type CreateSoftwareSystemInput = {
  customer_id: string;
  name: string;
  description?: string | null;
};

export const createSoftwareSystem = async (
  input: CreateSoftwareSystemInput,
  apiBaseUrl?: string
): Promise<ApiResponse<SoftwareSystem>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/software-systems`;
    const response = await fetch(url, {
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
    console.error('Error creating customer project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
