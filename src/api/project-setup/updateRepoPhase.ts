import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { ProjectRepo } from './types';

export const updateRepoPhase = async (
  projectId: string,
  repoId: string,
  updates: { current_phase?: string | null; phase_status?: string | null },
  apiBaseUrl?: string
): Promise<ApiResponse<ProjectRepo>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/projects/${projectId}/project-setup/repos/${repoId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
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
    console.error('Error updating repo phase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
