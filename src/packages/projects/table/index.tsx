'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
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

  const totalCount = Object.keys(projects).length;
  const countLabel =
    visibleProjects.length === totalCount
      ? `${totalCount} project${totalCount === 1 ? '' : 's'}`
      : `${visibleProjects.length} of ${totalCount} projects`;

  if (totalCount === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No projects yet</p>
        <p className={styles.emptyDescription}>
          Create a project to start defining schema and running the build pathway.
        </p>
      </div>
    );
  }

  if (visibleProjects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No matching projects</p>
        <p className={styles.emptyDescription}>Try a different search or customer.</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <span className={styles.count}>{countLabel}</span>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((column) => {
                const isActive = sortColumn === column.key;
                const ariaSort = isActive
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none';
                return (
                  <th key={column.key} className={styles.tableHeader} aria-sort={ariaSort}>
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className={styles.sortButton}
                    >
                      {column.label}
                      {isActive ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className={styles.sortIcon} aria-hidden />
                        ) : (
                          <ArrowDown className={styles.sortIcon} aria-hidden />
                        )
                      ) : null}
                    </button>
                  </th>
                );
              })}
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
  root: `
    flex flex-col flex-1 min-h-0 gap-2
  `,
  count: `
    text-xs text-gray-500 shrink-0
  `,
  tableContainer: `
    border border-gray-200 rounded-lg bg-white
    flex-1 min-h-0 overflow-auto
  `,
  table: `
    w-full text-left border-separate border-spacing-0
  `,
  tableHeader: `
    px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-50 border-b border-gray-200 sticky top-0 z-10
  `,
  sortButton: `
    inline-flex items-center gap-1 bg-transparent border-none cursor-pointer p-0
    text-xs font-semibold text-gray-600 uppercase tracking-wide
    hover:text-gray-900
  `,
  sortIcon: `
    w-3.5 h-3.5
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
