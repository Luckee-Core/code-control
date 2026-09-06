'use client';

import type { ProjectRepo } from '@/api/project-setup';
import { CopyGitCloneButton } from '@/components/copy-git-clone-button';

type RepoTableRowProps = {
  repo: ProjectRepo;
};

const SpinnerIcon = () => (
  <svg className={styles.spinnerSvg} fill="none" viewBox="0 0 24 24">
    <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const RepoTableRow = ({ repo }: RepoTableRowProps) => {
  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        {repo.repo_url ? (
          <a
            href={repo.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nameLink}
          >
            {repo.name}
          </a>
        ) : (
          <span className={styles.name}>{repo.name}</span>
        )}
      </td>
      <td className={styles.actionsCell}>
        {repo.repo_url ? (
          <CopyGitCloneButton cloneUrl={repo.clone_url} repoUrl={repo.repo_url} />
        ) : (
          <span className={styles.creatingText}>
            <SpinnerIcon /> Creating…
          </span>
        )}
      </td>
    </tr>
  );
};

const styles = {
  row: `
    border-b border-gray-100 hover:bg-gray-50 transition-colors
  `,
  cell: `
    px-4 py-3 text-sm text-gray-900 truncate
  `,
  actionsCell: `
    px-4 py-3 text-sm text-gray-900 whitespace-nowrap w-px
  `,
  name: `
    font-medium text-gray-900
  `,
  nameLink: `
    font-medium text-blue-600 hover:underline truncate block
  `,
  creatingText: `
    text-xs text-gray-500 inline-flex items-center gap-1
  `,
  spinnerSvg: `
    h-3 w-3 animate-spin
  `,
  spinnerCircle: `
    opacity-25
  `,
  spinnerPath: `
    opacity-75
  `,
};
