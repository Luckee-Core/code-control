import { AppThunk } from '@/store';
import { getReposByProjectId } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { ProjectReposActions } from '@/store/dumps';

type ResponseType = Promise<200 | 400 | 500>;

export const getReposByProjectIdThunk = (projectId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getReposByProjectId(projectId, getApiBaseUrl());
      
      if (!response.success || !response.data) {
        console.error('Failed to fetch repos:', response.error);
        return 500;
      }

      dispatch(ProjectReposActions.setProjectRepos(response.data));
      return 200;
    } catch (error) {
      console.error('Error fetching repos:', error);
      return 500;
    }
  };
};
