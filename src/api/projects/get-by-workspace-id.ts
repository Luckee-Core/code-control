import { ApiResponse } from '../types';
import type { Project } from '@/model/project';

/**
 * Get projects by workspace ID.
 */
export const getProjectsByWorkspaceId = async (
  workspaceId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<Project[]>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const url = `${baseUrl}/api/data/projects/workspace/${workspaceId}`;
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
