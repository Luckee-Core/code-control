import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { AiContextRequest, AiContextSnapshotResult } from '@/model/convention-responses';

/**
 * Builds AI context and saves it as a snapshot.
 */
export const createAiContextSnapshot = async (request: AiContextRequest, apiBaseUrl?: string): Promise<ApiResponse<AiContextSnapshotResult>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/ai-context/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createAiContextSnapshot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
