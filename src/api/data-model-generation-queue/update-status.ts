import { ApiResponse } from '../types';
import { DataModelGenerationQueue } from '@/model/data-model-generation-queue';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export type UpdateDataModelQueueStatusInput = {
  status: 'queued' | 'processing' | 'completed' | 'failed';
};

export const updateDataModelQueueStatus = async (
  queueItemId: string,
  input: UpdateDataModelQueueStatusInput
): Promise<ApiResponse<DataModelGenerationQueue>> => {
  const response = await fetch(
    `${BASE_URL}/api/data/data-model-generation-queue/${queueItemId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to update data model queue item' };
  }

  const data = await response.json();
  return { success: true, data };
};
