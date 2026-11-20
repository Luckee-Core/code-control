'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AGENT_RUN_DETAIL_PATHS } from '@/config/routes';
import type { AgentRun } from '@/model/agent-run';
import { useAppDispatch } from '@/store';
import { openAgentRunThunk } from '@/store/thunks/agent-runs';
import { AGENT_LABEL, STATUS_BADGE, STATUS_LABEL } from '../agent-run-labels';

type LineageStripProps = { lineage: AgentRun[]; handOffs: AgentRun[]; currentId: string };

const ORDER = { pr: 0, convention: 1, template: 2 } as const;
const FINAL_HIDDEN = new Set(['superseded']);

/**
 * The chain this run belongs to: PR agent → convention agent → template agent(s). Superseded
 * versions are folded into their latest version. Every node opens its run.
 */
export const LineageStrip = ({ lineage, handOffs, currentId }: LineageStripProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const nodes = useMemo(() => {
    const all = new Map([...lineage, ...handOffs].map((run) => [run.id, run]));
    return [...all.values()]
      .filter((run) => !FINAL_HIDDEN.has(run.status) || run.id === currentId)
      .sort((a, b) => ORDER[a.agent] - ORDER[b.agent] || a.created_at.localeCompare(b.created_at));
  }, [lineage, handOffs, currentId]);

  if (nodes.length <= 1) return null;
  const open = (run: AgentRun) => {
    void dispatch(openAgentRunThunk(run));
    router.push(AGENT_RUN_DETAIL_PATHS[run.agent]);
  };

  return (
    <nav className={styles.strip} aria-label="Agent chain">
      {nodes.map((run, index) => (
        <div key={run.id} className={styles.step}>
          {index > 0 ? <span className={styles.arrow}>→</span> : null}
          <button type="button" onClick={() => open(run)} className={run.id === currentId ? styles.nodeCurrent : styles.node} disabled={run.id === currentId}>
            <span className={styles.agent}>{AGENT_LABEL[run.agent]}{run.version > 1 ? ` v${run.version}` : ''}</span>
            <span className={STATUS_BADGE[run.status]}>{STATUS_LABEL[run.status]}</span>
          </button>
        </div>
      ))}
    </nav>
  );
};

const styles = {
  strip: `flex flex-wrap items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded`,
  step: `flex items-center gap-1`,
  arrow: `text-gray-400 text-xs px-1`,
  node: `flex items-center gap-2 px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer`,
  nodeCurrent: `flex items-center gap-2 px-2 py-1 rounded border border-gray-900 bg-gray-50 cursor-default`,
  agent: `text-[11px] font-medium text-gray-800`,
};
