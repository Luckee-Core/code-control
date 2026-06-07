import { ApiResponse } from '../types';
import { ProjectRepo } from '@/model';

export const getAllRepos = async (
  apiBaseUrl: string
): Promise<ApiResponse<ProjectRepo[]>> => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/data/project-repos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to fetch repos' };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error fetching all repos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
