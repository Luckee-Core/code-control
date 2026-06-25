import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { Project } from '@/model/project';

export const getAllProjects = async (
  apiBaseUrl?: string
): Promise<ApiResponse<Project[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/projects`;
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
    console.error('Error fetching all customer projects:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
