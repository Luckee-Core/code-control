import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { ConventionSnapshotsActions } from '../../dumps';
import { getConventionSnapshots } from '@/api/conventions';

type ResponseType = Promise<200 | 500>;

/**
 * Loads saved snapshots (newest first).
 */
export const getConventionSnapshotsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getConventionSnapshots({}, getApiBaseUrl());
      if (!response.success) {
        console.error('Failed to fetch snapshots:', response.error);
        return 500;
      }
      dispatch(ConventionSnapshotsActions.setConventionSnapshots(response.data ?? []));
      return 200;
    } catch (error) {
      console.error('Error fetching snapshots:', error);
      return 500;
    }
  };
};
