import type { CreateRepoResponse } from './types';
import type { CreateRepoOptions } from './createExpressRepo';

export const createWebRepo = async (
  projectId: string,
  apiBaseUrl?: string,
  options?: CreateRepoOptions
): Promise<CreateRepoResponse> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const url = `${baseUrl}/api/data/projects/${projectId}/project-setup/create-web-repo`;
    const body: { slug?: string; name?: string; owner?: string } = {};
    if (options?.name !== undefined && options.name !== '') {
      body.name = options.name;
    } else if (options?.slug !== undefined && options.slug !== '') {
      body.slug = options.slug;
    }
    if (options?.owner !== undefined && options.owner !== '') {
      body.owner = options.owner;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, error: data.error || response.statusText };
    }
    return data as CreateRepoResponse;
  } catch (error) {
    console.error('Error creating web repo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
