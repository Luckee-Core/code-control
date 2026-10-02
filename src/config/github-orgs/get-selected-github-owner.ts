import { getGithubOrgConfig } from './get-github-org-config';
import { LAST_GITHUB_ORG_KEY } from './last-github-org-key';

/**
 * Returns the GitHub owner from localStorage, falling back to the config default.
 */
export const getSelectedGithubOwner = (): string => {
  const config = getGithubOrgConfig();
  if (typeof window === 'undefined') {
    return config.defaultOrg;
  }

  const storedOrg = window.localStorage.getItem(LAST_GITHUB_ORG_KEY);
  if (storedOrg) {
    return storedOrg;
  }

  return config.defaultOrg;
};
