import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { ConventionsActions } from '../../dumps';
import { CurrentConventionActions } from '../../current';
import { deleteConvention } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Deletes the current convention.
 */
export const deleteConventionThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { id } = getState().currentConvention.convention;
    if (!id) return 400;
    try {
      const response = await deleteConvention(id, getApiBaseUrl());
      if (!response.success) {
        console.error('Failed to delete convention:', response.error);
        return 400;
      }
      dispatch(ConventionsActions.deleteConvention(id));
      dispatch(CurrentConventionActions.reset());
      return 200;
    } catch (error) {
      console.error('Error deleting convention:', error);
      return 500;
    }
  };
};
