import { getApiBaseUrl } from '../config';
import type { CreateRepoOptions } from './createExpressRepo';
import type { CreateRepoResponse } from './types';

/**
 * POST …/software-system-setup/create-storage-repo: creates a storage-express repo from GITHUB_TEMPLATE_STORAGE_EXPRESS.
 */
export const createStorageRepo = async (
  projectId: string,
  apiBaseUrl?: string,
  options?: CreateRepoOptions,
): Promise<CreateRepoResponse> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const body: { name?: string; slug?: string; owner?: string } = {};
    if (options?.name) body.name = options.name;
    else if (options?.slug) body.slug = options.slug;
    if (options?.owner) body.owner = options.owner;
    const response = await fetch(`${baseUrl}/api/data/software-systems/${projectId}/software-system-setup/create-storage-repo`, {
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
    console.error('Error creating storage repo:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};
