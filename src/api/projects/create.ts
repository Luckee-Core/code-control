import { ApiResponse } from '../types';
import type { Project } from '@/model/project';

export type CreateProjectInput = {
  workspace_id: string;
  name: string;
  description?: string | null;
  app_type?: string;
};

export const createProject = async (
  input: CreateProjectInput,
  apiBaseUrl?: string
): Promise<ApiResponse<Project>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const url = `${baseUrl}/api/data/projects`;
    const response = await fetch(url, {
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
    console.error('Error creating customer project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
