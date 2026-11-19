import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { toQuery } from './to-query';
import type { ConventionSnapshotSummary, ListConventionSnapshotsFilter } from '@/model/convention-snapshot';

/**
 * Lists saved snapshots.
 */
export const getConventionSnapshots = async (filter: ListConventionSnapshotsFilter = {}, apiBaseUrl?: string): Promise<ApiResponse<ConventionSnapshotSummary[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/snapshots${toQuery(filter)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
    console.error('Error in getConventionSnapshots:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
