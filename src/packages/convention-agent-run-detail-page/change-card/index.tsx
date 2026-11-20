'use client';

import { useMemo } from 'react';
import type { Convention } from '@/model/convention';
import type { ConventionChange } from '@/model/convention-change';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { AfterJsonInput } from '../inputs/after-json';
import { CHANGE_STATUS_BADGE, CHANGE_TYPE_LABEL, VERDICT_BADGE, VERDICT_LABEL } from '../labels';

type ChangeCardProps = {
  change: ConventionChange;
  related: Array<Convention & { role_keys: string[] }>;
  editable: boolean;
};

const show = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value) && value.every((item) => item && typeof item === 'object' && 'code' in item)) {
    // Examples: title, kind and code instead of raw JSON.
    return (value as Array<{ title?: string; kind?: string; code?: string }>)
      .map((example) => `${example.title ?? 'Example'} (${example.kind ?? 'example'})\n${example.code ?? ''}`)
      .join('\n\n');
  }
  if (Array.isArray(value)) return value.length === 0 ? '—' : value.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
  return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
};

/**
 * One proposed convention change: verdict, the existing rule it cites (side by side), what it
 * writes (before → after) and the reviewer's accept / reject / edit.
 */
export const ChangeCard = ({ change, related, editable }: ChangeCardProps) => {
  const dispatch = useAppDispatch();
  const decision = useAppSelector((state) => state.agentRunsBuilder.decisions[change.id]);
  const cited = useMemo(
    () => related.find((item) => item.key === (change.cited_key ?? change.convention_key)) ?? related.find((item) => item.key === change.convention_key) ?? null,
    [related, change.cited_key, change.convention_key],
  );
  const fields = useMemo(() => {
    const after = (change.after ?? {}) as Record<string, unknown>;
    const before = (change.before ?? {}) as Record<string, unknown>;
    return Object.keys(after)
      .filter((key) => !['domain_key', 'key'].includes(key))
      .map((key) => ({ key, before: change.change_type === 'create' ? undefined : before[key], after: after[key] }));
  }, [change]);
  const set = (patch: Parameters<typeof AgentRunsBuilderActions.setDecision>[0]['patch']) => dispatch(AgentRunsBuilderActions.setDecision({ id: change.id, patch }));

  return (
    <article className={decision?.action === 'accept' ? styles.cardAccepted : decision?.action === 'reject' ? styles.cardRejected : styles.card}>
      <header className={styles.header}>
        <span className={styles.type}>{CHANGE_TYPE_LABEL[change.change_type] ?? change.change_type}</span>
        <span className={styles.key}>{change.convention_key}</span>
        {change.verdict ? <span className={VERDICT_BADGE[change.verdict]}>{VERDICT_LABEL[change.verdict]}{change.cited_key && change.cited_key !== change.convention_key ? ` ${change.cited_key}` : ''}</span> : null}
        <span className={CHANGE_STATUS_BADGE[change.status]}>{change.status}</span>
        <span className={styles.roles}>{change.domain_key} · {change.role_keys.join(', ') || 'all roles'}</span>
      </header>
      {change.reason ? <p className={styles.reason}>{change.reason}</p> : null}

      <div className={styles.grid}>
        <div className={styles.column}>
          <p className={styles.columnTitle}>{cited ? `Existing: ${cited.key}` : 'Existing'}</p>
          {cited ? (
            <div className={styles.existing}>
              <p className={styles.existingTitle}>[{cited.severity.toUpperCase()}{cited.status !== 'active' ? `, ${cited.status}` : ''}] {cited.title}</p>
              <p className={styles.text}>{cited.statement}</p>
              {cited.rationale ? <p className={styles.muted}>Why: {cited.rationale}</p> : null}
              <p className={styles.muted}>Roles: {cited.role_keys.join(', ') || 'all'}</p>
            </div>
          ) : (
            <p className={styles.muted}>Nothing in the catalog covers this.</p>
          )}
        </div>
        <div className={styles.column}>
          <p className={styles.columnTitle}>Proposed</p>
          <table className={styles.table}>
            <tbody>
              {fields.map((field) => (
                <tr key={field.key}>
                  <td className={styles.fieldKey}>{field.key}</td>
                  <td className={styles.fieldValue}>
                    {field.before !== undefined ? <div className={styles.before}>{show(field.before)}</div> : null}
                    <div className={styles.after}>{show(field.after)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editable && change.status === 'proposed' ? (
        <footer className={styles.footer}>
          <div className={styles.buttons}>
            <button type="button" onClick={() => set({ action: 'accept' })} className={decision?.action === 'accept' ? styles.acceptOn : styles.accept}>
              Accept
            </button>
            <button type="button" onClick={() => set({ action: 'reject' })} className={decision?.action === 'reject' ? styles.rejectOn : styles.reject}>
              Reject
            </button>
            <button type="button" onClick={() => set({ editing: !decision?.editing, action: 'accept' })} className={styles.edit}>
              {decision?.editing ? 'Stop editing' : 'Edit before accepting'}
            </button>
          </div>
          {decision?.editing ? <AfterJsonInput changeId={change.id} /> : null}
        </footer>
      ) : null}
    </article>
  );
};

const card = `border rounded px-3 py-3 flex flex-col gap-2 bg-white`;
const toggle = `text-xs font-medium px-3 py-1 rounded border cursor-pointer`;
const styles = {
  card: `${card} border-gray-300`,
  cardAccepted: `${card} border-green-300 ring-1 ring-green-200`,
  cardRejected: `${card} border-red-200 opacity-75`,
  header: `flex flex-wrap items-center gap-2`,
  type: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  key: `font-mono text-xs text-gray-900`,
  roles: `ml-auto text-[11px] text-gray-500`,
  reason: `text-xs text-gray-700`,
  grid: `grid grid-cols-1 md:grid-cols-2 gap-3`,
  column: `flex flex-col gap-1 min-w-0`,
  columnTitle: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  existing: `bg-gray-50 border border-gray-200 rounded px-2 py-2 flex flex-col gap-1`,
  existingTitle: `text-xs font-medium text-gray-900`,
  text: `text-xs text-gray-800 whitespace-pre-wrap`,
  muted: `text-[11px] text-gray-500`,
  table: `w-full text-xs border-collapse`,
  fieldKey: `align-top pr-2 py-1 font-mono text-[11px] text-gray-500 whitespace-nowrap`,
  fieldValue: `py-1 min-w-0`,
  before: `text-[11px] text-red-800 bg-red-50 rounded px-1.5 py-0.5 line-through whitespace-pre-wrap break-words mb-0.5`,
  after: `text-[11px] text-green-900 bg-green-50 rounded px-1.5 py-0.5 whitespace-pre-wrap break-words`,
  footer: `flex flex-col gap-2 pt-2 border-t border-gray-100`,
  buttons: `flex flex-wrap gap-2`,
  accept: `${toggle} border-gray-300 text-gray-700 bg-white hover:bg-green-50`,
  acceptOn: `${toggle} border-green-600 bg-green-600 text-white`,
  reject: `${toggle} border-gray-300 text-gray-700 bg-white hover:bg-red-50`,
  rejectOn: `${toggle} border-red-600 bg-red-600 text-white`,
  edit: `${toggle} border-transparent text-blue-600 hover:underline`,
};
