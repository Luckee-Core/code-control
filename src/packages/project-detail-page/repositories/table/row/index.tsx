'use client';

import type { ProjectRepo } from '@/model';
import { CopyGitCloneButton } from './copy-git-clone-button';

type RowProps = {
  repo: ProjectRepo;
};

export const Row = ({ repo }: RowProps) => {
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
          <span className={styles.creatingText}>Creating…</span>
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
};
