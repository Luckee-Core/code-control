import { ApiResponse } from '../types';
import type { ProjectRepo } from './types';

export const getReposByProjectId = async (
  projectId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<ProjectRepo[]>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const url = `${baseUrl}/api/data/projects/${projectId}/project-setup/repos`;
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
    console.error('Error fetching project repos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
