import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { toQuery } from './to-query';
import type { Convention, ListConventionsFilter } from '@/model/convention';

/**
 * Lists conventions, optionally filtered.
 */
export const getAllConventions = async (filter: ListConventionsFilter = {}, apiBaseUrl?: string): Promise<ApiResponse<Convention[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions${toQuery(filter)}`, {
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
    console.error('Error in getAllConventions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
