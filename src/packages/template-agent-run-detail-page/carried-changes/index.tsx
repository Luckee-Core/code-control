'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { PILL } from '@/components/agent-runs';
import type { ConventionChangePropagation, ConventionChangePropagationStatus } from '@/model/agent-run';
import type { ConventionChange } from '@/model/convention-change';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';

type CarriedChangesProps = { changes: ConventionChange[]; propagations: ConventionChangePropagation[]; selectable: boolean };

const PROPAGATION_BADGE: Record<ConventionChangePropagationStatus, string> = {
  pending: `${PILL} bg-gray-50 text-gray-700 border-gray-300`,
  in_run: `${PILL} bg-amber-50 text-amber-800 border-amber-200`,
  merged: `${PILL} bg-green-50 text-green-700 border-green-200`,
  not_needed: `${PILL} bg-gray-50 text-gray-500 border-gray-200`,
  skipped: `${PILL} bg-gray-50 text-gray-400 border-gray-200`,
  denied: `${PILL} bg-red-50 text-red-700 border-red-200`,
};

/** Bookkeeping columns that say nothing about the rule itself. */
const HIDDEN_FIELDS = new Set(['id', 'convention_id', 'created_at', 'updated_at', 'sort_order', 'domain_key']);

const compact = (row: Record<string, unknown> | null, fields: string[]): string => {
  if (!row) return '—';
  const keep = fields.length > 0 ? fields : Object.keys(row).filter((field) => !HIDDEN_FIELDS.has(field) && row[field] !== null && row[field] !== '');
  return keep.filter((field) => field in row).map((field) => `${field}: ${typeof row[field] === 'object' ? JSON.stringify(row[field]) : String(row[field])}`).join(' · ');
};

/** Convention changes this template run carries (before → after) and where each one stands for this repo. */
export const CarriedChanges = ({ changes, propagations, selectable }: CarriedChangesProps) => {
  const dispatch = useAppDispatch();
  const scope = useAppSelector((state) => state.agentRunsBuilder.scope);
  const byChange = useMemo(() => {
    const map = new Map<string, ConventionChangePropagation[]>();
    for (const row of propagations) map.set(row.convention_change_id, [...(map.get(row.convention_change_id) ?? []), row]);
    return map;
  }, [propagations]);
  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Convention changes carried ({changes.length})</h2>
          <p className={detailPageStyles.panelSubtitle}>
            {selectable
              ? 'Already applied in the conventions. Each one goes to the template repos of its roles. Untick any you want to leave out of these template PRs.'
              : 'Already applied in the conventions. Badges show where each one stands per template repo.'}
          </p>
        </div>
      </div>
      <ul className={styles.list}>
        {changes.map((change) => {
          const rows = byChange.get(change.id) ?? [];
          return (
            <li key={change.id} className={styles.item}>
              {selectable ? (
                <input type="checkbox" checked={scope[change.id] ?? true} onChange={() => dispatch(AgentRunsBuilderActions.toggleScope(change.id))} aria-label={`Include ${change.convention_key}`} />
              ) : null}
              <div className={styles.main}>
                <div className={styles.row}>
                  <span className={styles.type}>{change.change_type}</span>
                  <span className={styles.key}>{change.convention_key}</span>
                  <span className={styles.source}>{change.source_type.replace('_', ' ')}</span>
                  {rows.map((row) => (
                    <span key={row.id} className={PROPAGATION_BADGE[row.status]} title={row.reason || undefined}>
                      {row.template_repo.split('/')[1] ?? row.template_repo}: {row.status.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                {change.reason ? <p className={styles.reason}>{change.reason}</p> : null}
                <p className={styles.before}>Before: {compact(change.before, change.changed_fields)}</p>
                <p className={styles.after}>After: {compact(change.after, change.changed_fields)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const styles = {
  list: `divide-y divide-gray-200`,
  item: `px-4 py-2 flex items-start gap-3`,
  main: `flex flex-col gap-0.5 min-w-0`,
  row: `flex flex-wrap items-center gap-2`,
  type: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  key: `font-mono text-xs text-gray-900`,
  source: `text-[11px] text-gray-500`,
  reason: `text-xs text-gray-700`,
  before: `text-[11px] text-red-800 break-words`,
  after: `text-[11px] text-green-800 break-words`,
};
