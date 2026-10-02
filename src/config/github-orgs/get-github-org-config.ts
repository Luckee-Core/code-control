import type { GithubOrgConfig } from './types';

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
    '';

  return {
    defaultOrg,
    options,
  };
};
