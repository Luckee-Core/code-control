import { ApiResponse } from '../types';

export type GithubOrgOptions = {
  defaultOwner: string;
  options: string[];
};

/**
 * Fetch allowed GitHub orgs for repo creation on a project.
 */
export const getGithubOrgs = async (
  projectId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<GithubOrgOptions>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const url = `${baseUrl}/api/data/projects/${projectId}/project-setup/github-orgs`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
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
    console.error('Error fetching GitHub org options:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
