import { AppThunk } from '../../types';
import { ProjectReposActions } from '../../dumps';
import { getAllRepos } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import type { ProjectRepo } from '@/api/project-setup';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllProjectReposThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllRepos(getApiBaseUrl());
      
      if (response.success && response.data) {
        dispatch(ProjectReposActions.setProjectRepos(response.data as ProjectRepo[]));
        return 200;
      }
      
      return 400;
    } catch (error) {
      console.error('Error fetching all customer project repos:', error);
      return 500;
    }
  };
};
