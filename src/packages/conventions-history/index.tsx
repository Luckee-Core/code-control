'use client';

import { useEffect, useMemo, useState } from 'react';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import { CONVENTIONS_PATH } from '@/config/routes';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { getConventionsThunk } from '@/store/thunks/conventions';
import { listConventionChangesThunk } from '@/store/thunks/convention-changes';
import { LedgerTable } from './ledger-table';

export { LedgerTable } from './ledger-table';

const CHANGE_TYPES = ['create', 'refine', 'deprecate', 'activate', 'status_change', 'severity_change', 'check_change', 'role_change', 'example_add', 'example_update', 'example_remove', 'delete'];
const SOURCES = ['manual', 'convention_agent', 'template_agent', 'migration'];

/** The convention change ledger: every change to every convention, with who/why and where it came from. */
export const ConventionsHistory = () => {
  const dispatch = useAppDispatch();
  const changes = useAppSelector((state) => state.conventionChanges);
  const catalog = useAppSelector((state) => state.conventionsCatalog);
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const [domain, setDomain] = useState('');
  const [changeType, setChangeType] = useState('');
  const [source, setSource] = useState('');
  const [search, setSearch] = useState('');

  useBreadcrumbs([{ label: 'Conventions', href: CONVENTIONS_PATH }, { label: 'History' }]);

  useEffect(() => {
    if (catalog.domains.length === 0) void dispatch(getConventionsThunk());
  }, [dispatch, catalog.domains.length]);
  useEffect(() => {
    void dispatch(listConventionChangesThunk({ domain_key: domain || undefined, change_type: changeType || undefined, source_type: source || undefined }));
  }, [dispatch, domain, changeType, source]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return Object.values(changes)
      .filter((change) => !term || `${change.convention_key} ${change.reason}`.toLowerCase().includes(term))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [changes, search]);

  return (
    <div className={styles.page}>
      <p className={styles.intro}>Every change to a convention, its roles or examples: manual edits, convention agent proposals (applied or rejected), reverts and the seeded baseline.</p>
      <div className={listFilterBarStyles.section}>
        <div className={listFilterBarStyles.searchInputWrapper}>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search key or reason" className={listFilterBarStyles.searchInput} />
        </div>
        <select value={domain} onChange={(event) => setDomain(event.target.value)} className={styles.select} aria-label="Domain">
          <option value="">All domains</option>
          {catalog.domains.map((item) => (
            <option key={item.key} value={item.key}>{item.name}</option>
          ))}
        </select>
        <select value={changeType} onChange={(event) => setChangeType(event.target.value)} className={styles.select} aria-label="Change type">
          <option value="">All changes</option>
          {CHANGE_TYPES.map((item) => (
            <option key={item} value={item}>{item.replace('_', ' ')}</option>
          ))}
        </select>
        <select value={source} onChange={(event) => setSource(event.target.value)} className={styles.select} aria-label="Source">
          <option value="">All sources</option>
          {SOURCES.map((item) => (
            <option key={item} value={item}>{item.replace('_', ' ')}</option>
          ))}
        </select>
        <span className={styles.count}>{builder.historyStatus === 'loading' ? 'Loading…' : `${visible.length} changes`}</span>
      </div>
      {builder.historyError ? <p className={styles.error}>{builder.historyError}</p> : null}
      <div className={styles.tableWrapper}>
        <LedgerTable changes={visible} showKey emptyText="No changes match these filters." />
      </div>
    </div>
  );
};

const styles = {
  page: `space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden`,
  intro: `text-xs text-gray-600 max-w-3xl`,
  select: `h-7 text-xs border border-gray-300 rounded px-2 bg-white cursor-pointer`,
  count: `text-xs text-gray-500`,
  error: `text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
  tableWrapper: `bg-white rounded border border-gray-300 overflow-visible flex-1 min-h-0 flex flex-col`,
};
