import type { DataModelGenerationQueue } from '@/model';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const getDataModelQueueByRepo = async (
  repoId: string,
  baseUrl: string
): Promise<ApiResponse<DataModelGenerationQueue[]>> => {
  try {
    const response = await fetch(`${baseUrl}/api/data/data-model-generation-queue/repo/${repoId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching data model queue:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
