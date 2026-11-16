import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { CurrentConventionActions } from '../../current';
import { deleteConventionSource } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Deletes one source from the current convention.
 */
export const deleteConventionSourceThunk = (sourceId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    if (!sourceId) return 400;
    try {
      const response = await deleteConventionSource(sourceId, getApiBaseUrl());
      if (!response.success) return 400;
      dispatch(CurrentConventionActions.removeSource(sourceId));
      return 200;
    } catch (error) {
      console.error('Error deleting source:', error);
      return 500;
    }
  };
};
