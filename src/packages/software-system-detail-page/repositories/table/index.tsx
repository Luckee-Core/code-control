'use client';

import type { SoftwareSystemRepo } from '@/model/software-system-repo';
import { Row } from './row';

const REPOSITORY_HEADER = 'Repository';
const ROLE_HEADER = 'Role';
const ACTIONS_HEADER = 'Actions';
const EMPTY_MESSAGE = 'No repositories yet';

type TableProps = {
  repos: SoftwareSystemRepo[];
};

export const Table = ({ repos }: TableProps) => {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>{REPOSITORY_HEADER}</th>
              <th className={styles.thRole}>{ROLE_HEADER}</th>
              <th className={styles.thActions}>{ACTIONS_HEADER}</th>
            </tr>
          </thead>
          <tbody>
            {repos.length === 0 ? (
              <tr>
                <td className={styles.emptyCell} colSpan={3}>
                  {EMPTY_MESSAGE}
                </td>
              </tr>
            ) : (
              repos.map((repo) => <Row key={repo.id} repo={repo} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-visible
  `,
  tableScrollContainer: `
    overflow-x-auto
  `,
  table: `
    w-full text-left border-collapse text-xs table-fixed
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300
  `,
  thRole: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 whitespace-nowrap w-36
  `,
  thActions: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 whitespace-nowrap w-28
  `,
  emptyCell: `
    px-3 py-8 text-xs text-gray-500 text-center
  `,
};
