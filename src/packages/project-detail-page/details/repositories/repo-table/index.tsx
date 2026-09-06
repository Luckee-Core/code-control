'use client';

import type { ProjectRepo } from '@/api/project-setup';
import { RepoTableRow } from './row';

const REPOSITORY_HEADER = 'Repository';
const ACTIONS_HEADER = 'Actions';
const EMPTY_MESSAGE = 'No repositories yet';

type RepoTableProps = {
  repos: ProjectRepo[];
};

export const RepoTable = ({ repos }: RepoTableProps) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>{REPOSITORY_HEADER}</th>
            <th className={styles.tableHeaderActions}>{ACTIONS_HEADER}</th>
          </tr>
        </thead>
        <tbody>
          {repos.length === 0 ? (
            <tr>
              <td className={styles.emptyCell} colSpan={2}>
                {EMPTY_MESSAGE}
              </td>
            </tr>
          ) : (
            repos.map((repo) => (
              <RepoTableRow key={repo.id} repo={repo} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: `
    border border-gray-200 rounded-lg overflow-hidden bg-white
  `,
  table: `
    w-full text-left border-collapse table-fixed
  `,
  tableHeader: `
    px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-50 border-b border-gray-200
  `,
  tableHeaderActions: `
    px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-50 border-b border-gray-200 whitespace-nowrap w-28
  `,
  emptyCell: `
    px-4 py-6 text-sm text-gray-500 text-center
  `,
};
