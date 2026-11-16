import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ConventionRole } from '@/model/convention-role';

/**
 * Replaces a convention's repo roles.
 */
export const replaceConventionRoles = async (id: string, roleKeys: string[], apiBaseUrl?: string): Promise<ApiResponse<ConventionRole[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/${id}/roles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_keys: roleKeys }),
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
    console.error('Error in replaceConventionRoles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
