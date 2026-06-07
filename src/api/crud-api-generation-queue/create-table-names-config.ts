import type { CrudApiGenerationQueue } from '@/model/crud-api-generation-queue';

export type CreateTableNamesConfigResult = {
  success: boolean;
  item?: CrudApiGenerationQueue;
  error?: string;
};

export const createTableNamesConfigQueueItem = async (
  repoId: string,
  baseUrl: string
): Promise<CreateTableNamesConfigResult> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/data/crud-api-generation-queue/repo/${repoId}/table-names-config`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body?.error ?? 'Failed to enqueue table names config' };
    }

    const data = await response.json();
    return { success: true, item: data.item };
  } catch (error) {
    console.error('Error enqueueing table names config:', error);
    return { success: false, error: 'Network error' };
  }
};
