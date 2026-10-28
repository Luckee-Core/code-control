'use client';

import { useMemo, useState } from 'react';
import { useAppSelector } from '@/store';
import type { Project } from '@/model/project';
import { Row } from './row';

type ProjectSortColumn = 'name' | 'customer' | 'description' | 'updated';

type SortDirection = 'asc' | 'desc';

type TableProps = {
  search: string;
  customerId: string;
};

const COLUMNS: { key: ProjectSortColumn; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'customer', label: 'Customer' },
  { key: 'description', label: 'Description' },
  { key: 'updated', label: 'Updated' },
];

export const Table = ({ search, customerId }: TableProps) => {
  const projects = useAppSelector((state) => state.projects);
  const customers = useAppSelector((state) => state.customers);
  const [sortColumn, setSortColumn] = useState<ProjectSortColumn>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const customerNameById = useMemo(() => {
    const map = new Map<string, string>();
    Object.values(customers).forEach((customer) => {
      map.set(customer.id, customer.name);
    });
    return map;
  }, [customers]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = Object.values(projects).filter((project) => {
      if (customerId && project.customer_id !== customerId) return false;
      if (!query) return true;
      const haystack = [
        project.name,
        project.description ?? '',
        customerNameById.get(project.customer_id) ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

    const direction = sortDirection === 'asc' ? 1 : -1;
    const valueFor = (project: Project): string => {
      switch (sortColumn) {
        case 'name':
          return project.name;
        case 'customer':
          return customerNameById.get(project.customer_id) ?? '';
        case 'description':
          return project.description ?? '';
        case 'updated':
          return project.updated_at;
        default:
          return '';
      }
    };

    return [...list].sort(
      (a, b) =>
        valueFor(a).localeCompare(valueFor(b), undefined, { sensitivity: 'base' }) * direction
    );
  }, [projects, search, customerId, sortColumn, sortDirection, customerNameById]);

  const handleSort = (column: ProjectSortColumn) => {
    if (sortColumn === column) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortColumn(column);
    setSortDirection(column === 'updated' ? 'desc' : 'asc');
  };

  const getSortIcon = (column: ProjectSortColumn) => {
    if (sortColumn !== column) {
      return '↕';
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const totalCount = Object.keys(projects).length;

  if (totalCount === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No projects yet</p>
        </div>
      </div>
    );
  }

  if (visibleProjects.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No matching projects. Try a different search or customer.</p>
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
                <th key={column.key} className={styles.th}>
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className={styles.sortButton}
                  >
                    <span>{column.label}</span>
                    <span className={styles.sortIcon}>{getSortIcon(column.key)}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project) => (
              <Row key={project.id} project={project} />
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
  th: `p-0 text-left bg-gray-100 border-b border-gray-300`,
  sortButton: `
    flex w-full items-center justify-between gap-1 px-3 py-2
    text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    cursor-pointer hover:bg-gray-200 transition-colors
    border-none bg-transparent
  `,
  sortIcon: `text-[10px] text-gray-500 shrink-0 normal-case`,
} as const;
