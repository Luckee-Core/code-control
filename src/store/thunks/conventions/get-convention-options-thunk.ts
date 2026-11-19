import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { ConventionOptionsActions } from '../../dumps';
import { getConventionOptions } from '@/api/conventions';

type ResponseType = Promise<200 | 500>;

/**
 * Loads domains, topics and repo roles (dropdown options).
 */
export const getConventionOptionsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getConventionOptions(getApiBaseUrl());
      if (!response.success || !response.data) {
        console.error('Failed to fetch convention options:', response.error);
        return 500;
      }
      dispatch(ConventionOptionsActions.setConventionOptions(response.data));
      return 200;
    } catch (error) {
      console.error('Error fetching convention options:', error);
      return 500;
    }
  };
};
