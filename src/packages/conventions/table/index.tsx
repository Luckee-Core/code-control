'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import type { ConventionFilters } from '../filters';
import { filterConventions } from '../filter-conventions';
import { Row } from './row';

type TableProps = {
  filters: ConventionFilters;
};

const COLUMNS = ['Key', 'Title', 'Topic', 'Severity', 'Status'];

export const Table = ({ filters }: TableProps) => {
  const conventions = useAppSelector((state) => state.conventions);
  const options = useAppSelector((state) => state.conventionOptions);

  const topicNameByKey = useMemo(
    () => new Map(options.topics.map((topic) => [topic.key, topic.name])),
    [options.topics]
  );

  const visible = useMemo(
    () => filterConventions(Object.values(conventions), options.topics, filters),
    [conventions, options.topics, filters]
  );

  if (Object.keys(conventions).length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No conventions yet</p>
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
              {COLUMNS.map((label) => (
                <th key={label} className={styles.th}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((convention) => (
              <Row
                key={convention.id}
                convention={convention}
                topicName={topicNameByKey.get(convention.topic_key) ?? convention.topic_key}
              />
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
