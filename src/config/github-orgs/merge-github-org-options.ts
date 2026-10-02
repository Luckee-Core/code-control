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
