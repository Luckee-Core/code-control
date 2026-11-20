'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { detailPageStyles } from '@/components/detail-page-styles';
import { AGENT_LABEL } from '../agent-run-labels';
import { StatusBadge } from '../status-badge';
import { AGENT_RUN_DETAIL_PATHS } from '@/config/routes';
import type { AgentRun } from '@/model/agent-run';
import { useAppDispatch } from '@/store';
import { openAgentRunThunk } from '@/store/thunks/agent-runs';

type HandOffProps = { title: string; runs: AgentRun[]; children?: ReactNode };

/** What an approved run produced and which agent draft(s) it handed off to. */
export const HandOff = ({ title, runs, children }: HandOffProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>{title}</h2>
      </div>
      <div className={styles.body}>
        {children}
        {runs.length === 0 ? <p className={styles.muted}>No next agent was created.</p> : null}
        {runs.map((run) => (
          <button
            key={run.id}
            type="button"
            className={styles.next}
            onClick={() => {
              void dispatch(openAgentRunThunk(run));
              router.push(AGENT_RUN_DETAIL_PATHS[run.agent]);
            }}
          >
            <span className={styles.agent}>{AGENT_LABEL[run.agent]}</span>
            <StatusBadge status={run.status} />
            <span className={styles.open}>Open →</span>
          </button>
        ))}
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-3 flex flex-col gap-2`,
  muted: `text-xs text-gray-500`,
  next: `flex items-center gap-3 px-3 py-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-left`,
  agent: `text-xs font-medium text-gray-900`,
  open: `ml-auto text-xs text-blue-600`,
};
