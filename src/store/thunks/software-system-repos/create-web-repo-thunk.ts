import { AppThunk } from '@/store';
import { createReactNativeRepo, createWebRepo } from '@/api/software-system-setup';
import { getApiBaseUrl } from '@/api/config';
import { RepositoriesBuilderActions } from '@/store/builders';
import { getReposBySoftwareSystemIdThunk } from './get-repos-by-project-id-thunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a Next.js or React Native GitHub repo from repositoriesBuilder.
 */
export const createWebRepoThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { currentSoftwareSystem, repositoriesBuilder } = getState();
    const name = repositoriesBuilder.webRepoName.trim();
    if (!currentSoftwareSystem.id || !name) {
      return 400;
    }

    dispatch(RepositoriesBuilderActions.setSaveStatus('saving'));
    const owner = repositoriesBuilder.selectedGithubOrg;
    const createRepo =
      repositoriesBuilder.frontendRuntime === 'react-native'
        ? createReactNativeRepo
        : createWebRepo;
    const response = await createRepo(currentSoftwareSystem.id, getApiBaseUrl(), {
      name,
      ...(owner ? { owner } : {}),
    });

    if (!response.success) {
      dispatch(RepositoriesBuilderActions.setSaveStatus('error'));
      dispatch(RepositoriesBuilderActions.setLinkError(response.error ?? 'Failed'));
      return 400;
    }

    dispatch(RepositoriesBuilderActions.closeWebCreate());
    await dispatch(getReposBySoftwareSystemIdThunk());
    return 200;
  };
};
