import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ConventionSource, CreateConventionSourceInput } from '@/model/convention-source';

/**
 * Adds a source to a convention.
 */
export const createConventionSource = async (id: string, input: Omit<CreateConventionSourceInput, 'convention_id'>, apiBaseUrl?: string): Promise<ApiResponse<ConventionSource>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/${id}/sources`, {
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
    console.error('Error in createConventionSource:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
