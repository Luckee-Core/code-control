import type { CursorGenerationRequest } from '@/model';
import { getApiBaseUrl } from '../config';

/**
 * Get cursor generation requests by project ID
 *
 * @param projectId - Project ID
 * @returns Array of cursor generation requests
 */
export const getCursorGenerationRequestsByProject = async (
  projectId: string
): Promise<CursorGenerationRequest[]> => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/data/cursor-generation/requests?project_id=${projectId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch cursor generation requests');
  }

  return response.json();
};

/**
 * Get cursor generation requests by entity ID
 *
 * @param entityId - Entity ID
 * @returns Array of cursor generation requests
 */
export const getCursorGenerationRequestsByEntity = async (
  entityId: string
): Promise<CursorGenerationRequest[]> => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/data/cursor-generation/requests?entity_id=${entityId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch cursor generation requests');
  }

  return response.json();
};
