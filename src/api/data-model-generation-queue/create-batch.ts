import type { DataModelGenerationQueue } from '@/model';

type CreateBatchInput = {
  project_id: string;
  repo_id: string;
  entity_ids: string[];
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const createBatchDataModelQueue = async (
  input: CreateBatchInput,
  baseUrl: string
): Promise<ApiResponse<DataModelGenerationQueue[]>> => {
  try {
    const response = await fetch(`${baseUrl}/api/data/data-model-generation-queue/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error creating batch data model queue:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
