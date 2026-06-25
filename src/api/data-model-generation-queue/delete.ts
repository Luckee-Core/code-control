import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';

export const deleteDataModelQueueItem = async (
  queueItemId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<void>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  
  const response = await fetch(`${baseUrl}/api/data/data-model-generation-queue/${queueItemId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to delete queue item' };
  }

  const result = await response.json();
  return { success: true, data: undefined };
};
