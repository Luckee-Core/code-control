import type { CreateRepoResponse } from './types';

export type CreateRepoOptions = { slug?: string; name?: string; owner?: string };

export const createExpressRepo = async (
  projectId: string,
  apiBaseUrl?: string,
  options?: CreateRepoOptions
): Promise<CreateRepoResponse> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const url = `${baseUrl}/api/data/projects/${projectId}/project-setup/create-express-repo`;
    const body: { slug?: string; owner?: string } = {};
    if (options?.slug !== undefined && options.slug !== '') {
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
    console.error('Error creating express repo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
