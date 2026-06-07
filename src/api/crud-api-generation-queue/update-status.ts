import type { CrudApiGenerationQueue } from '@/model/crud-api-generation-queue';

export type UpdateCrudApiQueueStatusInput = {
  status?: 'queued' | 'processing' | 'completed' | 'failed';
  pr_link?: string | null;
  error?: string | null;
};

export const updateCrudApiQueueStatus = async (
  queueItemId: string,
  input: UpdateCrudApiQueueStatusInput,
  baseUrl: string
): Promise<{ success: boolean; data?: CrudApiGenerationQueue; error?: string }> => {
  try {
    const response = await fetch(`${baseUrl}/api/data/crud-api-generation-queue/${queueItemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.error || 'Failed to update queue item' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error updating CRUD API queue status:', error);
    return { success: false, error: 'Network error' };
  }
};
