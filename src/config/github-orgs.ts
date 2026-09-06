/**
 * GitHub org options for repo creation UI.
 * Parsed from NEXT_PUBLIC_GITHUB_ALLOWED_ORGS (comma-separated).
 */
export type GithubOrgConfig = {
  defaultOrg: string;
  options: string[];
};

const parseOrgList = (raw: string | undefined): string[] => {
  if (!raw?.trim()) {
    return [];
  }

  return raw
    .split(',')
    .map((org) => org.trim())
    .filter(Boolean);
};

export const LAST_GITHUB_ORG_KEY = 'code-control:last-github-org';

/**
 * GitHub org picker config for the Repositories tab.
 */
export const getGithubOrgConfig = (): GithubOrgConfig => {
  const options = parseOrgList(process.env.NEXT_PUBLIC_GITHUB_ALLOWED_ORGS);

  const defaultOrg =
    process.env.NEXT_PUBLIC_GITHUB_DEFAULT_ORG?.trim() ||
    process.env.NEXT_PUBLIC_GITHUB_OWNER?.trim() ||
    options[0] ||
    '';

  return {
    defaultOrg,
    options,
  };
};

/**
 * Merge config orgs with API orgs so the UI never drops configured options.
 */
export const mergeGithubOrgOptions = (
  configOptions: string[],
  apiOptions: string[] | undefined
): string[] => {
  const merged = [...configOptions];

  if (Array.isArray(apiOptions)) {
    for (const org of apiOptions) {
      if (!merged.includes(org)) {
        merged.push(org);
      }
    }
  }

  return merged;
};

/**
 * Returns the GitHub owner from localStorage (including API-merged orgs not in config.options).
 * Empty or missing values fall back to the config default.
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
