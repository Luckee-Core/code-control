'use client';

import { useEffect, useMemo } from 'react';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import type { AgentKind } from '@/model/agent-run';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { listAgentRunsThunk } from '@/store/thunks/agent-runs';
import { STATUS_FILTERS, STATUS_LABEL } from '../agent-run-labels';
import { RUN_COLUMNS } from './columns';
import { Row } from './row';

type RunsTableProps = { agent: AgentKind; emptyText: string };

const POLL_MS = 5000;

/**
 * Agent runs list for one agent: status filter, search, newest first. Polls while any run is
 * running so statuses update in place.
 */
export const RunsTable = ({ agent, emptyText }: RunsTableProps) => {
  const dispatch = useAppDispatch();
  const runs = useAppSelector((state) => state.agentRuns);
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const filters = builder.filters[agent] ?? { status: '', search: '' };
  const columns = RUN_COLUMNS[agent];

  const all = useMemo(
    () => Object.values(runs).filter((run) => run.agent === agent).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [runs, agent],
  );
  const visible = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return all.filter(
      (run) =>
        (!filters.status || run.status === filters.status) &&
        (!search ||
          [run.title, run.summary, run.software_system_name ?? '', ...run.template_changes.map((change) => change.repo_full_name), run.delivery?.repo_full_name ?? '']
            .join(' ')
            .toLowerCase()
            .includes(search)),
    );
  }, [all, filters]);
  const anyRunning = useMemo(() => all.some((run) => run.status === 'running'), [all]);

  useEffect(() => {
    void dispatch(listAgentRunsThunk({ agent }));
  }, [dispatch, agent]);
  useEffect(() => {
    if (!anyRunning) return;
    const timer = setInterval(() => void dispatch(listAgentRunsThunk({ agent }, true)), POLL_MS);
    return () => clearInterval(timer);
  }, [dispatch, agent, anyRunning]);

  const setFilters = (patch: { status?: string; search?: string }) => dispatch(AgentRunsBuilderActions.setFilters({ agent, filters: patch }));

  return (
    <div className={styles.wrap}>
      <div className={listFilterBarStyles.section}>
        <div className={listFilterBarStyles.searchInputWrapper}>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            placeholder="Search title, project, repo"
            aria-label="Search runs"
            className={listFilterBarStyles.searchInput}
          />
        </div>
        <select value={filters.status} onChange={(event) => setFilters({ status: event.target.value })} className={styles.select} aria-label="Status">
          <option value="">All statuses</option>
          {STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <span className={styles.count}>{visible.length === all.length ? `${all.length} runs` : `${visible.length} of ${all.length} runs`}</span>
        {builder.listStatus === 'loading' ? <span className={styles.count}>Loading…</span> : null}
      </div>
      {builder.listError ? <p className={styles.error}>{builder.listError}</p> : null}
      <div className={styles.tableWrapper}>
        {visible.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>{all.length === 0 ? emptyText : 'No runs match these filters.'}</p>
          </div>
        ) : (
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {['Status', 'Run', ...columns.map((column) => column.label)].map((label) => (
                    <th key={label} className={styles.th}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((run) => (
                  <Row key={run.id} run={run} columns={columns} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrap: `space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden`,
  select: `h-7 text-xs border border-gray-300 rounded px-2 bg-white cursor-pointer`,
  count: `text-xs text-gray-500`,
  error: `text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
  tableWrapper: `bg-white rounded border border-gray-300 overflow-visible flex-1 min-h-0 flex flex-col`,
  scroll: `overflow-x-auto overflow-y-auto flex-1 min-h-0`,
  emptyState: `text-center py-12`,
  emptyText: `text-gray-500 text-sm`,
  table: `w-full border-collapse text-xs`,
  th: `px-3 py-2 text-left bg-gray-100 border-b border-gray-300 text-[10px] font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap`,
} as const;
