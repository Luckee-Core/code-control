import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { AiContextBuilderActions } from '../../builders';
import { getConventionSnapshot } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads one snapshot's full text into the view modal.
 */
export const viewConventionSnapshotThunk = (snapshotId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    if (!snapshotId) return 400;
    try {
      const response = await getConventionSnapshot(snapshotId, getApiBaseUrl());
      if (!response.success || !response.data) {
        console.error('Failed to load snapshot:', response.error);
        return 400;
      }
      dispatch(AiContextBuilderActions.setViewingSnapshot(response.data));
      return 200;
    } catch (error) {
      console.error('Error loading snapshot:', error);
      return 500;
    }
  };
};
