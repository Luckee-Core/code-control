type GitCloneSource = {
  clone_url?: string | null;
  repo_url?: string | null;
};

/**
 * Build a terminal-ready `git clone` command from repo URLs.
 */
export const buildGitCloneCommand = (source: GitCloneSource): string | null => {
  const cloneUrl =
    source.clone_url ??
    (source.repo_url ? `${source.repo_url.replace(/\/$/, '')}.git` : null);

  if (!cloneUrl) {
    return null;
  }

  return `git clone ${cloneUrl}`;
};
