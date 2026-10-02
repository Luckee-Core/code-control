import { AppThunk } from '@/store';
import { createWebRepo } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { RepositoriesBuilderActions } from '@/store/builders';
import { getReposByProjectIdThunk } from './get-repos-by-project-id-thunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a Next.js GitHub repo from repositoriesBuilder.webRepoName.
 */
export const createWebRepoThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { currentProject, repositoriesBuilder } = getState();
    const name = repositoriesBuilder.webRepoName.trim();
    if (!currentProject.id || !name) {
      return 400;
    }

    dispatch(RepositoriesBuilderActions.setSaveStatus('saving'));
    const owner = repositoriesBuilder.selectedGithubOrg;
    const response = await createWebRepo(currentProject.id, getApiBaseUrl(), {
      name,
      ...(owner ? { owner } : {}),
    });

    if (!response.success) {
      dispatch(RepositoriesBuilderActions.setSaveStatus('error'));
      dispatch(RepositoriesBuilderActions.setLinkError(response.error ?? 'Failed'));
      return 400;
    }

    dispatch(RepositoriesBuilderActions.closeWebCreate());
    await dispatch(getReposByProjectIdThunk());
    return 200;
  };
};
