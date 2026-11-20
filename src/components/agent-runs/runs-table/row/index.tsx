'use client';

import { useRouter } from 'next/navigation';
import type { AgentRunListItem } from '@/api/agent-runs';
import { AGENT_RUN_DETAIL_PATHS } from '@/config/routes';
import { useAppDispatch } from '@/store';
import { openAgentRunThunk } from '@/store/thunks/agent-runs';
import { StatusBadge } from '../../status-badge';
import type { RunColumn } from '../columns';

type RowProps = { run: AgentRunListItem; columns: RunColumn[] };

export const Row = ({ run, columns }: RowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const open = () => {
    void dispatch(openAgentRunThunk(run));
    router.push(AGENT_RUN_DETAIL_PATHS[run.agent]);
  };
  return (
    <tr className={styles.row} onClick={open}>
      <td className={styles.cell}>
        <StatusBadge status={run.status} />
      </td>
      <td className={styles.cell}>
        <button type="button" onClick={open} className={styles.title}>
          {run.title || 'Untitled run'}
        </button>
        {run.error ? <div className={styles.error}>{run.error}</div> : null}
      </td>
      {columns.map((column) => (
        <td key={column.label} className={styles.cellMuted}>
          {column.render(run)}
        </td>
      ))}
    </tr>
  );
};

const styles = {
  row: `hover:bg-gray-50 transition-colors align-top cursor-pointer`,
  cell: `px-3 py-2 text-xs text-gray-900 border-b border-gray-200`,
  cellMuted: `px-3 py-2 text-xs text-gray-600 border-b border-gray-200 whitespace-nowrap`,
  title: `font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0`,
  error: `mt-0.5 text-[11px] text-red-700 line-clamp-2`,
};
