import type {
  CrudApiGenerationQueue,
  CreateCrudApiQueueItemInput,
} from '@/model/crud-api-generation-queue';

export const createCrudApiQueueItems = async (
  items: CreateCrudApiQueueItemInput[],
  baseUrl: string
): Promise<{ success: boolean; data?: CrudApiGenerationQueue[]; error?: string }> => {
  try {
    const response = await fetch(`${baseUrl}/api/data/crud-api-generation-queue/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to create queue items' };
    }

    const data = await response.json();
    return { success: true, data: data.items };
  } catch (error) {
    console.error('Error creating CRUD API queue items:', error);
    return { success: false, error: 'Network error' };
  }
};
