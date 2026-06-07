import type { CursorGenerationResponse } from '@/model';
import { getApiBaseUrl } from '../config';

/**
 * Get cursor generation response by ID
 *
 * @param responseId - Response ID
 * @returns Response or null
 */
export const getCursorGenerationResponseById = async (
  responseId: string
): Promise<CursorGenerationResponse | null> => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/data/cursor-generation/responses/${responseId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch cursor generation response');
  }

  return response.json();
};
