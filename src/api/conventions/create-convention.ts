import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { Convention, CreateConventionInput } from '@/model/convention';

/**
 * Creates a convention.
 */
export const createConvention = async (input: CreateConventionInput, apiBaseUrl?: string): Promise<ApiResponse<Convention>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions`, {
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
    console.error('Error in createConvention:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
