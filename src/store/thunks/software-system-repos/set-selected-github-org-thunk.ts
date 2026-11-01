import { AppThunk } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { LAST_GITHUB_ORG_KEY } from '@/config/github-orgs/last-github-org-key';

/**
 * Stores the selected GitHub org in the builder and localStorage.
 */
export const setSelectedGithubOrgThunk = (
  org: string
): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    dispatch(RepositoriesBuilderActions.setSelectedGithubOrg(org));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_GITHUB_ORG_KEY, org);
    }
    return 200;
  };
};
