import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { ConventionsActions } from '../../dumps';
import { getAllConventions } from '@/api/conventions';

type ResponseType = Promise<200 | 500>;

/**
 * Loads every convention into the dump.
 */
export const getAllConventionsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllConventions({}, getApiBaseUrl());
      if (!response.success) {
        console.error('Failed to fetch conventions:', response.error);
        return 500;
      }
      dispatch(ConventionsActions.setConventions(response.data ?? []));
      return 200;
    } catch (error) {
      console.error('Error fetching conventions:', error);
      return 500;
    }
  };
};
