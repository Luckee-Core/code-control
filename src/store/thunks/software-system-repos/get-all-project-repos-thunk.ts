import { AppThunk } from '../../types';
import { SoftwareSystemReposActions } from '../../dumps';
import { getAllRepos } from '@/api/software-system-setup';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads every project repo into the dump.
 */
export const getAllSoftwareSystemReposThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllRepos(getApiBaseUrl());

      if (response.success && response.data) {
        dispatch(SoftwareSystemReposActions.setSoftwareSystemRepos(response.data));
        return 200;
      }

      return 400;
    } catch (error) {
      console.error('Error fetching all customer project repos:', error);
      return 500;
    }
  };
};
