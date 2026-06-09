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

/**
 * GitHub org picker config for the Repositories tab.
 */
export const getGithubOrgConfig = (): GithubOrgConfig => {
  const options = parseOrgList(process.env.NEXT_PUBLIC_GITHUB_ALLOWED_ORGS);

  const defaultOrg =
    process.env.NEXT_PUBLIC_GITHUB_DEFAULT_ORG?.trim() ||
    process.env.NEXT_PUBLIC_GITHUB_OWNER?.trim() ||
    options[0] ||
    'trouthouse-tech';

  return {
    defaultOrg,
    options: options.length > 0 ? options : [defaultOrg],
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

  return merged.length > 0 ? merged : configOptions;
};
