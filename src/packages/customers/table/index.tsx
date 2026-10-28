'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { Row } from './row';

type TableProps = {
  searchTerm: string;
};

export const Table = ({ searchTerm }: TableProps) => {
  const customers = useAppSelector((state) => state.customers);

  const customerList = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const list = Object.values(customers);
    const filtered = query
      ? list.filter((customer) => customer.name.toLowerCase().includes(query))
      : list;
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, searchTerm]);

  if (Object.keys(customers).length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No customers yet.</p>
        </div>
      </div>
    );
  }

  if (customerList.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No customers match your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Stage</th>
              <th className={styles.th}>Projects</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((customer) => (
              <Row key={customer.id} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-visible flex-1 min-h-0 flex flex-col
  `,
  tableScrollContainer: `
    overflow-x-auto overflow-y-auto flex-1 min-h-0
  `,
  emptyState: `
    text-center py-12
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
};
