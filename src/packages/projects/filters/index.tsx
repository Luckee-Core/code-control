'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentProjectActions } from '@/store/current';

type FiltersProps = {
  search: string;
  customerId: string;
  onSearchChange: (value: string) => void;
  onCustomerChange: (customerId: string) => void;
};

export const Filters = ({
  search,
  customerId,
  onSearchChange,
  onCustomerChange,
}: FiltersProps) => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const customers = useAppSelector((state) => state.customers);

  const customerOptions = useMemo(
    () =>
      Object.values(customers)
        .map((customer) => ({ id: customer.id, name: customer.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [customers]
  );

  const totalCount = useMemo(() => Object.keys(projects).length, [projects]);

  const countLabel = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = Object.values(projects).filter((project) => {
      if (customerId && project.customer_id !== customerId) return false;
      if (!query) return true;
      const customerName =
        customers[project.customer_id]?.name ?? '';
      const haystack = [project.name, project.description ?? '', customerName]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    }).length;
    if (query || customerId) {
      return `${filtered} of ${totalCount} project${totalCount === 1 ? '' : 's'}`;
    }
    return `${totalCount} project${totalCount === 1 ? '' : 's'}`;
  }, [projects, customers, search, customerId, totalCount]);

  const handleCreateProject = () => {
    dispatch(CurrentProjectActions.reset());
    dispatch(WorkspaceBuilderActions.openProjectModal(null));
  };

  return (
    <div className={listFilterBarStyles.section}>
      <div className={listFilterBarStyles.searchInputWrapper}>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, description, or customer"
          aria-label="Search projects"
          className={listFilterBarStyles.searchInput}
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className={listFilterBarStyles.clearButton}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>
      <select
        value={customerId}
        onChange={(event) => onCustomerChange(event.target.value)}
        aria-label="Filter by customer"
        className={styles.customerSelect}
      >
        <option value="">All customers</option>
        {customerOptions.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
      <span className={styles.count}>{countLabel}</span>
      <div className={styles.right}>
        <button type="button" onClick={handleCreateProject} className={detailPageStyles.primaryButton}>
          Create project
        </button>
      </div>
    </div>
  );
};

const styles = {
  customerSelect: `
    h-7 px-2 text-xs text-gray-900 bg-white border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer
  `,
  count: `shrink-0 text-xs text-gray-600 tabular-nums`,
  right: `ml-auto flex items-center gap-2 flex-wrap`,
} as const;
