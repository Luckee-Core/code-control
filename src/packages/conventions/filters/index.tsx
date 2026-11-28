'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import { CONVENTIONS_CONTEXT_PATH, CONVENTIONS_VOCABULARY_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { startConventionFormThunk } from '@/store/thunks/conventions';
import { ConventionsFiltersActions } from '@/store/filters';
import { filterConventions, listTopicNames } from '../filter-conventions';

const SEVERITIES = ['must', 'never', 'should', 'avoid'];
const STATUSES = ['active', 'draft', 'deprecated'];

export const Filters = () => {
  const dispatch = useAppDispatch();
  const conventions = useAppSelector((state) => state.conventions);
  const catalog = useAppSelector((state) => state.conventionsCatalog);
  const filters = useAppSelector((state) => state.conventionsFilters);

  const countLabel = useMemo(() => {
    const all = Object.values(conventions);
    const shown = filterConventions(all, catalog.topics, catalog.convention_roles, filters).length;
    const isFiltered = Object.values(filters).some(Boolean);
    const noun = `convention${all.length === 1 ? '' : 's'}`;
    return isFiltered ? `${shown} of ${all.length} ${noun}` : `${all.length} ${noun}`;
  }, [conventions, catalog.topics, catalog.convention_roles, filters]);

  const topicNames = useMemo(() => listTopicNames(catalog.topics), [catalog.topics]);

  return (
    <div className={listFilterBarStyles.section}>
      <div className={listFilterBarStyles.searchInputWrapper}>
        <input
          type="search"
          value={filters.searchTerm}
          onChange={(event) => dispatch(ConventionsFiltersActions.setSearchTerm(event.target.value))}
          placeholder="Search key, title, or statement"
          aria-label="Search conventions"
          className={listFilterBarStyles.searchInput}
        />
        {filters.searchTerm ? (
          <button
            type="button"
            onClick={() => dispatch(ConventionsFiltersActions.setSearchTerm(''))}
            className={listFilterBarStyles.clearButton}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>
      <select
        value={filters.topicName}
        onChange={(event) => dispatch(ConventionsFiltersActions.setTopicName(event.target.value))}
        aria-label="Filter by topic"
        className={styles.select}
      >
        <option value="">All topics</option>
        {topicNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={filters.roleKey}
        onChange={(event) => dispatch(ConventionsFiltersActions.setRoleKey(event.target.value))}
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
        onChange={(event) => dispatch(ConventionsFiltersActions.setSeverity(event.target.value))}
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
        onChange={(event) => dispatch(ConventionsFiltersActions.setStatus(event.target.value))}
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
