import { AppThunk } from '@/store';
import { createExpressRepo } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { RepositoriesBuilderActions } from '@/store/builders';
import { getReposByProjectIdThunk } from './get-repos-by-project-id-thunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates an Express GitHub repo from repositoriesBuilder.expressRepoName.
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
    const response = await createExpressRepo(currentProject.id, getApiBaseUrl(), {
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
