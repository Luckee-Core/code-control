'use client';

import type { ReactNode } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { AgentRun } from '@/model/agent-run';
import { formatDateTimeWithTime } from '@/utils/date-time';
import { AGENT_LABEL } from '../agent-run-labels';
import { StatusBadge } from '../status-badge';

type RunHeaderProps = { run: AgentRun; subtitle?: ReactNode; children?: ReactNode };

const when = (value: string | null): string => (value ? formatDateTimeWithTime(value) : '—');

/** Title, status and timing for any agent run. */
export const RunHeader = ({ run, subtitle, children }: RunHeaderProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <div className={styles.titleBlock}>
        <div className={styles.titleRow}>
          <span className={styles.agent}>{AGENT_LABEL[run.agent]}</span>
          <StatusBadge status={run.status} />
          {run.version > 1 ? <span className={styles.version}>v{run.version}</span> : null}
        </div>
        <h1 className={styles.title}>{run.title || AGENT_LABEL[run.agent]}</h1>
        {subtitle ? <div className={detailPageStyles.panelSubtitle}>{subtitle}</div> : null}
      </div>
      {children ? <div className={styles.side}>{children}</div> : null}
    </div>
    <dl className={styles.meta}>
      <div><dt className={styles.label}>Created</dt><dd className={styles.value}>{when(run.created_at)}</dd></div>
      <div><dt className={styles.label}>Confirmed</dt><dd className={styles.value}>{when(run.confirmed_at)}</dd></div>
      <div><dt className={styles.label}>Finished</dt><dd className={styles.value}>{when(run.finished_at)}</dd></div>
      <div><dt className={styles.label}>Decided</dt><dd className={styles.value}>{when(run.decided_at)}</dd></div>
      <div><dt className={styles.label}>Model</dt><dd className={styles.value}>{run.model || '—'}</dd></div>
      <div>
        <dt className={styles.label}>Tokens</dt>
        <dd className={styles.value}>{run.input_tokens + run.output_tokens > 0 ? `${run.input_tokens.toLocaleString()} in · ${run.output_tokens.toLocaleString()} out` : '—'}</dd>
      </div>
    </dl>
    {run.summary ? <p className={styles.summary}>{run.summary}</p> : null}
    {run.decision_note ? <p className={styles.note}><span className={styles.noteLabel}>Reviewer note:</span> {run.decision_note}</p> : null}
    {run.error ? <p className={styles.error}>{run.error}</p> : null}
  </section>
);

const styles = {
  titleBlock: `flex flex-col gap-1 min-w-0`,
  titleRow: `flex items-center gap-2`,
  agent: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  version: `text-[10px] font-mono text-gray-500`,
  title: `text-sm font-semibold text-gray-900 break-words`,
  side: `flex flex-col items-end gap-1 text-xs`,
  meta: `px-4 py-3 grid grid-cols-2 md:grid-cols-6 gap-3`,
  label: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  value: `text-xs text-gray-900 mt-0.5`,
  summary: `px-4 pb-3 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap`,
  note: `px-4 pb-3 text-xs text-gray-700`,
  noteLabel: `font-semibold`,
  error: `mx-4 mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 whitespace-pre-wrap`,
};
