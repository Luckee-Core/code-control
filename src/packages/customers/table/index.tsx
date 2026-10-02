'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { Row } from './row';

export const Table = () => {
  const customers = useAppSelector((state) => state.customers);
  const customerList = useMemo(
    () => Object.values(customers).sort((a, b) => a.name.localeCompare(b.name)),
    [customers]
  );

  if (customerList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No customers yet</p>
        <p className={styles.emptyDescription}>Add a customer to get started.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Stage</th>
            <th className={styles.tableHeader}>Projects</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((customer) => (
            <Row key={customer.id} customer={customer} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: `
    border border-gray-200 rounded-lg overflow-auto bg-white flex-1 min-h-0
  `,
  table: `
    w-full text-left border-collapse
  `,
  tableHeader: `
    px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-200
  `,
  emptyState: `
    border border-gray-200 rounded-lg bg-white p-8 text-center
  `,
  emptyTitle: `
    text-sm font-medium text-gray-900 mb-1
  `,
  emptyDescription: `
    text-sm text-gray-500
  `,
};
