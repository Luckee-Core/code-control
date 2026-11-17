'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { filterConventions, type ConventionFilterState } from '../filter-conventions';
import { Row } from './row';

type TableProps = {
  filters: ConventionFilterState;
};

const COLUMNS = ['Convention', 'Topic', 'Severity', 'Status', 'Roles', 'Check'];

export const Table = ({ filters }: TableProps) => {
  const conventions = useAppSelector((state) => state.conventions);
  const catalog = useAppSelector((state) => state.conventionsCatalog);

  const topicOrder = useMemo(() => {
    const map = new Map<string, number>();
    catalog.topics.forEach((topic, index) => map.set(topic.key, index));
    return map;
  }, [catalog.topics]);

  const visible = useMemo(
    () =>
      filterConventions(Object.values(conventions), catalog.convention_roles, filters).sort(
        (a, b) =>
          (topicOrder.get(a.topic_key) ?? 999) - (topicOrder.get(b.topic_key) ?? 999) ||
          a.sort_order - b.sort_order ||
          a.key.localeCompare(b.key),
      ),
    [conventions, catalog.convention_roles, filters, topicOrder],
  );

  if (Object.keys(conventions).length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No conventions yet. Apply storage migrations 097–098 to seed them.</p>
        </div>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No matching conventions. Try different filters.</p>
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
              {COLUMNS.map((column) => (
                <th key={column} className={styles.th}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((convention) => (
              <Row key={convention.id} convention={convention} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  tableWrapper: `bg-white rounded border border-gray-300 overflow-visible flex-1 min-h-0 flex flex-col`,
  tableScrollContainer: `overflow-x-auto overflow-y-auto flex-1 min-h-0`,
  emptyState: `text-center py-12`,
  emptyText: `text-gray-500 text-sm`,
  table: `w-full border-collapse text-xs`,
  th: `
    px-3 py-2 text-left bg-gray-100 border-b border-gray-300
    text-[10px] font-semibold text-gray-600 uppercase tracking-wide
  `,
} as const;
