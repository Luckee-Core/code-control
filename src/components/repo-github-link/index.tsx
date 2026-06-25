type RepoGithubLinkProps = {
  repoUrl: string;
  label?: string;
};

const ExternalLinkIcon = () => (
  <svg className={styles.externalLinkSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

/**
 * Link to a GitHub repository page.
 */
export const RepoGithubLink = ({ repoUrl, label = 'GitHub' }: RepoGithubLinkProps) => {
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {label}
      <ExternalLinkIcon />
    </a>
  );
};

const styles = {
  link: `
    text-xs text-blue-600 hover:underline inline-flex items-center gap-1 shrink-0
  `,
  externalLinkSvg: `
    h-3 w-3
  `,
};
