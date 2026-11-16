import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ConventionExample, CreateConventionExampleInput } from '@/model/convention-example';

/**
 * Adds an example to a convention.
 */
export const createConventionExample = async (id: string, input: Omit<CreateConventionExampleInput, 'convention_id'>, apiBaseUrl?: string): Promise<ApiResponse<ConventionExample>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/${id}/examples`, {
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
    console.error('Error in createConventionExample:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
