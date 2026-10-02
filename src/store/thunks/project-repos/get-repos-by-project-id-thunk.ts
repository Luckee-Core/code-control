import { AppThunk } from '@/store';
import { getReposByProjectId } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { ProjectReposActions } from '@/store/dumps';
import { RepositoriesBuilderActions } from '@/store/builders';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads repos for currentProject into the dump.
 */
export const getReposByProjectIdThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const projectId = getState().currentProject.id;
      if (!projectId) {
        return 400;
      }
      dispatch(RepositoriesBuilderActions.setListLoadStatus('loading'));
      const response = await getReposByProjectId(projectId, getApiBaseUrl());

      if (!response.success || !response.data) {
        console.error('Failed to fetch repos:', response.error);
        dispatch(RepositoriesBuilderActions.setListLoadStatus('error'));
        return 500;
      }

      dispatch(
        ProjectReposActions.replaceReposByProjectId({
          projectId,
          repos: response.data,
        })
      );
      dispatch(RepositoriesBuilderActions.setListLoadStatus('idle'));
      return 200;
    } catch (error) {
      console.error('Error fetching repos:', error);
      dispatch(RepositoriesBuilderActions.setListLoadStatus('error'));
      return 500;
    }
  };
};
