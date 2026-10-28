'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CUSTOMERS_PATH, PROJECTS_PATH } from '@/config/routes';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch } from '@/store';
import { CustomerBuilderActions, WorkspaceBuilderActions } from '@/store/builders';

type QuickLinkRow = {
  id: string;
  module: string;
  description: string;
  href: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

/**
 * Shortcuts into core Code Control lists.
 */
export const DashboardQuickLinks = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const rows: QuickLinkRow[] = [
    {
      id: 'customers',
      module: 'Customers',
      description: 'Accounts you deliver software for',
      href: CUSTOMERS_PATH,
      primaryLabel: 'View all',
      secondaryLabel: 'Add customer',
      onSecondary: () => {
        dispatch(CustomerBuilderActions.openCustomerModal());
        router.push(CUSTOMERS_PATH);
      },
    },
    {
      id: 'projects',
      module: 'Projects',
      description: 'Engagements, repos, and templates',
      href: PROJECTS_PATH,
      primaryLabel: 'View all',
      secondaryLabel: 'Create project',
      onSecondary: () => {
        dispatch(WorkspaceBuilderActions.openProjectModal(null));
        router.push(PROJECTS_PATH);
      },
    },
  ];

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>Quick links</h2>
      </div>
      <div className={detailPageStyles.panelBody}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Module</th>
                <th className={styles.thPurpose}>Purpose</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={styles.row}>
                  <td className={styles.cell}>
                    <span className={styles.nameText}>{row.module}</span>
                  </td>
                  <td className={`${styles.cell} ${styles.cellTruncate}`}>{row.description}</td>
                  <td className={`${styles.cell} ${styles.cellActions}`}>
                    <Link href={row.href} className={styles.linkButton}>
                      {row.primaryLabel}
                    </Link>
                    {row.secondaryLabel && row.onSecondary ? (
                      <button type="button" className={styles.primaryButton} onClick={row.onSecondary}>
                        {row.secondaryLabel}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const styles = {
  tableScroll: `overflow-x-auto`,
  table: `w-full text-left text-sm border-collapse`,
  th: `
    px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide
    border-b border-gray-300 bg-gray-50
  `,
  thPurpose: `
    px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide
    border-b border-gray-300 bg-gray-50 hidden sm:table-cell
  `,
  thActions: `
    px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide
    border-b border-gray-300 bg-gray-50 text-right w-40
  `,
  row: `border-b border-gray-200 last:border-b-0`,
  cell: `px-3 py-2.5 align-middle text-gray-800`,
  cellTruncate: `text-gray-600 max-w-md truncate hidden sm:table-cell`,
  cellActions: `text-right space-x-2 whitespace-nowrap`,
  nameText: `font-medium text-gray-900`,
  linkButton: `
    text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer
  `,
  primaryButton: `
    text-xs font-medium px-2 py-1 rounded border border-gray-300 bg-white
    hover:bg-gray-50 cursor-pointer
  `,
};
