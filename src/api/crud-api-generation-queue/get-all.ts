import type { CrudApiGenerationQueue } from '@/model/crud-api-generation-queue';

export const getAllCrudApiQueue = async (
  baseUrl: string
): Promise<{ success: boolean; data?: CrudApiGenerationQueue[]; error?: string }> => {
  try {
    const response = await fetch(`${baseUrl}/api/data/crud-api-generation-queue`);

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch queue' };
    }

    const data = await response.json();
    return { success: true, data: data.items };
  } catch (error) {
    console.error('Error fetching CRUD API queue:', error);
    return { success: false, error: 'Network error' };
  }
};
