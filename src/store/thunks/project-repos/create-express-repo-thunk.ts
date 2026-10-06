import { AppThunk } from '@/store';
import { createExpressRepo, createPythonRepo } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { RepositoriesBuilderActions } from '@/store/builders';
import { getReposByProjectIdThunk } from './get-repos-by-project-id-thunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates an Express or Python GitHub repo from repositoriesBuilder.
 */
export const createExpressRepoThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { currentProject, repositoriesBuilder } = getState();
    const name = repositoriesBuilder.expressRepoName.trim();
    if (!currentProject.id || !name) {
      return 400;
    }

    dispatch(RepositoriesBuilderActions.setSaveStatus('saving'));
    const owner = repositoriesBuilder.selectedGithubOrg;
    const createRepo =
      repositoriesBuilder.serverRuntime === 'python' ? createPythonRepo : createExpressRepo;
    const response = await createRepo(currentProject.id, getApiBaseUrl(), {
      name,
      ...(owner ? { owner } : {}),
    });

    if (!response.success) {
      dispatch(RepositoriesBuilderActions.setSaveStatus('error'));
      dispatch(RepositoriesBuilderActions.setLinkError(response.error ?? 'Failed'));
      return 400;
    }

    dispatch(RepositoriesBuilderActions.closeExpressCreate());
    await dispatch(getReposByProjectIdThunk());
    return 200;
  };
};
