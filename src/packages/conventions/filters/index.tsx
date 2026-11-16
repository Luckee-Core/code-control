'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import { formFieldStyles } from '@/components/form-field-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionBuilderActions } from '@/store/builders';
import { CONVENTION_SEVERITIES, CONVENTION_STATUSES } from '../convention-enums';
import { filterConventions } from '../filter-conventions';

export type ConventionFilters = {
  search: string;
  topicKey: string;
  severity: string;
  status: string;
};

type FiltersProps = {
  filters: ConventionFilters;
  onChange: (filters: ConventionFilters) => void;
  onClear: () => void;
};

export const Filters = ({ filters, onChange, onClear }: FiltersProps) => {
  const dispatch = useAppDispatch();
  const conventions = useAppSelector((state) => state.conventions);
  const options = useAppSelector((state) => state.conventionOptions);

  const countLabel = useMemo(() => {
    const all = Object.values(conventions);
    const shown = filterConventions(all, options.topics, filters).length;
    return shown === all.length ? `${all.length} conventions` : `${shown} of ${all.length} conventions`;
  }, [conventions, options.topics, filters]);

  const hasFilters = Boolean(filters.search || filters.topicKey || filters.severity || filters.status);

  return (
    <div className={listFilterBarStyles.section}>
      <div className={listFilterBarStyles.searchInputWrapper}>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search key, title, or statement"
          aria-label="Search conventions"
          className={listFilterBarStyles.searchInput}
        />
      </div>
      <select
        value={filters.topicKey}
        onChange={(event) => onChange({ ...filters, topicKey: event.target.value })}
        className={formFieldStyles.select}
        aria-label="Topic"
      >
        <option value="">All topics</option>
        {options.topics.map((topic) => (
          <option key={topic.key} value={topic.key}>
            {topic.name}
          </option>
        ))}
      </select>
      <select
        value={filters.severity}
        onChange={(event) => onChange({ ...filters, severity: event.target.value })}
        className={formFieldStyles.select}
        aria-label="Severity"
      >
        <option value="">All severities</option>
        {CONVENTION_SEVERITIES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value })}
        className={formFieldStyles.select}
        aria-label="Status"
      >
        <option value="">All statuses</option>
        {CONVENTION_STATUSES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      {hasFilters ? (
        <button type="button" onClick={onClear} className={listFilterBarStyles.clearFiltersButton}>
          Clear filters
        </button>
      ) : null}
      <span className={styles.count}>{countLabel}</span>
      <button
        type="button"
        onClick={() => dispatch(ConventionBuilderActions.openCreateModal())}
        className={detailPageStyles.primaryButton}
      >
        New convention
      </button>
    </div>
  );
};

const styles = {
  count: `
    ml-auto text-xs text-gray-500
  `,
};
