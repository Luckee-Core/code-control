import { AppThunk } from '@/store';
import { linkExistingRepo } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { RepositoriesBuilderActions } from '@/store/builders';
import { getReposByProjectIdThunk } from './get-repos-by-project-id-thunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Links an existing GitHub repo using repositoriesBuilder fields.
 */
export const linkExistingRepoThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { currentProject, repositoriesBuilder } = getState();
    const repoUrl = repositoriesBuilder.existingRepoUrl.trim();
    if (!currentProject.id || !repoUrl) {
      return 400;
    }

    dispatch(RepositoriesBuilderActions.setSaveStatus('saving'));
    dispatch(RepositoriesBuilderActions.setLinkError(''));
    const response = await linkExistingRepo(
      currentProject.id,
      { repo_type: repositoriesBuilder.existingRepoType, repo_url: repoUrl },
      getApiBaseUrl()
    );

    if (!response.success) {
      dispatch(RepositoriesBuilderActions.setSaveStatus('error'));
      dispatch(RepositoriesBuilderActions.setLinkError(response.error ?? 'Failed to add repository'));
      return 400;
    }

    dispatch(RepositoriesBuilderActions.closeAddExisting());
    await dispatch(getReposByProjectIdThunk());
    return 200;
  };
};
