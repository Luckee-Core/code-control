'use client';

import type { AgentRun } from '@/model/agent-run';
import { useAppDispatch } from '@/store';
import { openAgentRunThunk } from '@/store/thunks/agent-runs';
import { STATUS_LABEL } from '../agent-run-labels';

type VersionsTabsProps = { versions: AgentRun[]; currentId: string };

/** v1 / v2 / … of a revised run. */
export const VersionsTabs = ({ versions, currentId }: VersionsTabsProps) => {
  const dispatch = useAppDispatch();
  if (versions.length <= 1) return null;
  return (
    <div className={styles.tabs} role="tablist" aria-label="Versions">
      {versions.map((run) => (
        <button
          key={run.id}
          type="button"
          role="tab"
          aria-selected={run.id === currentId}
          onClick={() => void dispatch(openAgentRunThunk(run))}
          className={run.id === currentId ? styles.tabActive : styles.tab}
        >
          v{run.version} · {STATUS_LABEL[run.status]}
        </button>
      ))}
    </div>
  );
};

const styles = {
  tabs: `flex flex-wrap gap-1`,
  tab: `text-[11px] px-2 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer`,
  tabActive: `text-[11px] px-2 py-1 rounded border border-gray-900 bg-gray-900 text-white cursor-default`,
};
