import { AppThunk } from '../../types';
import { ProjectReposActions } from '../../dumps';
import { getAllRepos } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads every project repo into the dump.
 */
export const getAllProjectReposThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllRepos(getApiBaseUrl());

      if (response.success && response.data) {
        dispatch(ProjectReposActions.setProjectRepos(response.data));
        return 200;
      }

      return 400;
    } catch (error) {
      console.error('Error fetching all customer project repos:', error);
      return 500;
    }
  };
};
