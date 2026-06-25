import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { Project } from '@/model/project';

export type UpdateProjectInput = {
  name?: string;
  description?: string | null;
};

export const updateProject = async (
  id: string,
  input: UpdateProjectInput,
  apiBaseUrl?: string
): Promise<ApiResponse<Project>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/projects/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
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
    console.error('Error updating customer project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
