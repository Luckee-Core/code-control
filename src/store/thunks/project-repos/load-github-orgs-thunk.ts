import { AppThunk } from '@/store';
import { getGithubOrgs } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { RepositoriesBuilderActions } from '@/store/builders';
import { getGithubOrgConfig } from '@/config/github-orgs/get-github-org-config';
import { mergeGithubOrgOptions } from '@/config/github-orgs/merge-github-org-options';
import { LAST_GITHUB_ORG_KEY } from '@/config/github-orgs/last-github-org-key';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads GitHub org options for the current project.
 */
export const loadGithubOrgsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      return 400;
    }

    const config = getGithubOrgConfig();
    const response = await getGithubOrgs(projectId, getApiBaseUrl());

    if (!response.success) {
      dispatch(
        RepositoriesBuilderActions.setGithubSetupError(
          response.error ?? 'GitHub is not configured on the Express server.'
        )
      );
      return 400;
    }

    dispatch(RepositoriesBuilderActions.setGithubSetupError(''));
    const options = mergeGithubOrgOptions(
      config.options,
      response.data ? response.data.options : undefined
    );
    dispatch(RepositoriesBuilderActions.setGithubOrgOptions(options));

    const defaultOrg = response.data?.defaultOwner || config.defaultOrg;
    const storedOrg =
      typeof window !== 'undefined' ? window.localStorage.getItem(LAST_GITHUB_ORG_KEY) : null;
    const initialOrg = storedOrg && options.includes(storedOrg) ? storedOrg : defaultOrg;
    dispatch(RepositoriesBuilderActions.setSelectedGithubOrg(initialOrg));
    return 200;
  };
};
