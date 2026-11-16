import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ConventionVocabulary } from '@/model/convention-responses';

/**
 * Loads the data-model vocabulary.
 */
export const getConventionVocabulary = async (apiBaseUrl?: string): Promise<ApiResponse<ConventionVocabulary>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/vocabulary`, {
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
    console.error('Error in getConventionVocabulary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
