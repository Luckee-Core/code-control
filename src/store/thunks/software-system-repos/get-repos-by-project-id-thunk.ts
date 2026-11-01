import { AppThunk } from '@/store';
import { getReposBySoftwareSystemId } from '@/api/software-system-setup';
import { getApiBaseUrl } from '@/api/config';
import { SoftwareSystemReposActions } from '@/store/dumps';
import { RepositoriesBuilderActions } from '@/store/builders';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads repos for currentSoftwareSystem into the dump.
 */
export const getReposBySoftwareSystemIdThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const projectId = getState().currentSoftwareSystem.id;
      if (!projectId) {
        return 400;
      }
      dispatch(RepositoriesBuilderActions.setListLoadStatus('loading'));
      const response = await getReposBySoftwareSystemId(projectId, getApiBaseUrl());

      if (!response.success) {
        console.error('Failed to fetch repos:', response.error);
        dispatch(RepositoriesBuilderActions.setListLoadStatus('error'));
        return 500;
      }

      dispatch(
        SoftwareSystemReposActions.replaceReposBySoftwareSystemId({
          softwareSystemId: projectId,
          repos: response.data ?? [],
        }),
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
