import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { CurrentConventionActions } from '../../current';
import { getConventionDetail } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads roles, examples and sources for the current convention.
 */
export const loadCurrentConventionDetailThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const { id } = getState().currentConvention.convention;
      if (!id) return 400;
      const response = await getConventionDetail(id, getApiBaseUrl());
      if (!response.success || !response.data) {
        console.error('Failed to load convention detail:', response.error);
        return 500;
      }
      dispatch(CurrentConventionActions.setDetail(response.data));
      return 200;
    } catch (error) {
      console.error('Error loading convention detail:', error);
      return 500;
    }
  };
};
