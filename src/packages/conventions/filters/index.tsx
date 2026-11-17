'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import { CONVENTIONS_CONTEXT_PATH, CONVENTIONS_VOCABULARY_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { startConventionFormThunk } from '@/store/thunks/conventions';
import { filterConventions, type ConventionFilterState } from '../filter-conventions';

type FiltersProps = {
  filters: ConventionFilterState;
  onChange: (filters: ConventionFilterState) => void;
};

const SEVERITIES = ['must', 'never', 'should', 'avoid'];
const STATUSES = ['active', 'draft', 'deprecated'];

export const Filters = ({ filters, onChange }: FiltersProps) => {
  const dispatch = useAppDispatch();
  const conventions = useAppSelector((state) => state.conventions);
  const catalog = useAppSelector((state) => state.conventionsCatalog);

  const countLabel = useMemo(() => {
    const all = Object.values(conventions);
    const shown = filterConventions(all, catalog.convention_roles, filters).length;
    const isFiltered = Object.values(filters).some(Boolean);
    const noun = `convention${all.length === 1 ? '' : 's'}`;
    return isFiltered ? `${shown} of ${all.length} ${noun}` : `${all.length} ${noun}`;
  }, [conventions, catalog.convention_roles, filters]);

  const set = (patch: Partial<ConventionFilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className={listFilterBarStyles.section}>
      <div className={listFilterBarStyles.searchInputWrapper}>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => set({ search: event.target.value })}
          placeholder="Search key, title, or statement"
          aria-label="Search conventions"
          className={listFilterBarStyles.searchInput}
        />
        {filters.search ? (
          <button
            type="button"
            onClick={() => set({ search: '' })}
            className={listFilterBarStyles.clearButton}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>
      <select
        value={filters.topicKey}
        onChange={(event) => set({ topicKey: event.target.value })}
        aria-label="Filter by topic"
        className={styles.select}
      >
        <option value="">All topics</option>
        {catalog.topics.map((topic) => (
          <option key={topic.key} value={topic.key}>
            {topic.name}
          </option>
        ))}
      </select>
      <select
        value={filters.roleKey}
        onChange={(event) => set({ roleKey: event.target.value })}
        aria-label="Filter by repo role"
        className={styles.select}
      >
        <option value="">All repo roles</option>
        {catalog.repo_roles.map((role) => (
          <option key={role.key} value={role.key}>
            {role.name}
          </option>
        ))}
      </select>
      <select
        value={filters.severity}
        onChange={(event) => set({ severity: event.target.value })}
        aria-label="Filter by severity"
        className={styles.select}
      >
        <option value="">All severities</option>
        {SEVERITIES.map((severity) => (
          <option key={severity} value={severity}>
            {severity.toUpperCase()}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(event) => set({ status: event.target.value })}
        aria-label="Filter by status"
        className={styles.select}
      >
        <option value="">All statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <span className={styles.count}>{countLabel}</span>
      <div className={styles.right}>
        <Link href={CONVENTIONS_VOCABULARY_PATH} className={detailPageStyles.secondaryButton}>
          Vocabulary
        </Link>
        <Link href={CONVENTIONS_CONTEXT_PATH} className={detailPageStyles.secondaryButton}>
          AI context
        </Link>
        <button
          type="button"
          onClick={() => void dispatch(startConventionFormThunk('new'))}
          className={detailPageStyles.primaryButton}
        >
          New convention
        </button>
      </div>
    </div>
  );
};

const styles = {
  select: `
    h-7 px-2 text-xs text-gray-900 bg-white border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer
  `,
  count: `shrink-0 text-xs text-gray-600 tabular-nums`,
  right: `ml-auto flex items-center gap-2 flex-wrap`,
} as const;
