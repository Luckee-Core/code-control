import { getApiBaseUrl } from '../config';
import type { CreateRepoResponse, RepoType } from './types';

export type LinkExistingRepoOptions = {
  repo_type: Extract<RepoType, 'express' | 'nextjs'>;
  repo_url: string;
};

export const linkExistingRepo = async (
  projectId: string,
  options: LinkExistingRepoOptions,
  apiBaseUrl?: string
): Promise<CreateRepoResponse> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/projects/${projectId}/project-setup/link-existing-repo`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, error: data.error || response.statusText };
    }
    return data as CreateRepoResponse;
  } catch (error) {
    console.error('Error linking existing repo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
