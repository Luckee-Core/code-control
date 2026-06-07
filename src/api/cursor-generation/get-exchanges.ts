import type { CursorGenerationExchange } from '@/model';
import { getApiBaseUrl } from '../config';

/**
 * Get cursor generation exchanges by request ID
 *
 * @param requestId - Request ID
 * @returns Array of cursor generation exchanges
 */
export const getCursorGenerationExchangesByRequest = async (
  requestId: string
): Promise<CursorGenerationExchange[]> => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/data/cursor-generation/exchanges?request_id=${requestId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch cursor generation exchanges');
  }

  return response.json();
};

/**
 * Get a single cursor generation exchange by ID
 *
 * @param exchangeId - Exchange ID
 * @returns Exchange or null
 */
export const getCursorGenerationExchangeById = async (
  exchangeId: string
): Promise<CursorGenerationExchange | null> => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/data/cursor-generation/exchanges/${exchangeId}`,
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
    throw new Error(error.error || 'Failed to fetch cursor generation exchange');
  }

  return response.json();
};
