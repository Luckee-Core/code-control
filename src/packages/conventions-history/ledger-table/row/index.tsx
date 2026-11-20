'use client';

import { useRouter } from 'next/navigation';
import { PILL } from '@/components/agent-runs';
import { AGENT_RUN_DETAIL_PATHS } from '@/config/routes';
import type { ConventionChange } from '@/model/convention-change';
import { useAppDispatch } from '@/store';
import { openAgentRunThunk } from '@/store/thunks/agent-runs';
import { formatDateTimeWithTime } from '@/utils/date-time';

type RowProps = { change: ConventionChange; showKey: boolean };

const STATUS_BADGE: Record<ConventionChange['status'], string> = {
  proposed: `${PILL} bg-amber-50 text-amber-800 border-amber-200`,
  applied: `${PILL} bg-green-50 text-green-700 border-green-200`,
  rejected: `${PILL} bg-red-50 text-red-700 border-red-200`,
  superseded: `${PILL} bg-gray-50 text-gray-400 border-gray-200`,
};

const AGENT_SOURCES: Record<string, 'convention' | 'template'> = { convention_agent: 'convention', template_agent: 'template' };

export const Row = ({ change, showKey }: RowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const agent = AGENT_SOURCES[change.source_type];
  const openSource = () => {
    if (!agent || !change.source_id) return;
    void dispatch(openAgentRunThunk({ id: change.source_id, instructions: '', input: {} }));
    router.push(AGENT_RUN_DETAIL_PATHS[agent]);
  };
  return (
    <tr className={styles.row}>
      <td className={styles.cellMuted}>{formatDateTimeWithTime(change.created_at)}</td>
      {showKey ? <td className={styles.cell}><span className={styles.key}>{change.convention_key}</span></td> : null}
      <td className={styles.cell}>{change.change_type.replace('_', ' ')}</td>
      <td className={styles.cellMuted}>{change.changed_fields.join(', ') || '—'}</td>
      <td className={styles.cellMuted}>
        {agent && change.source_id ? (
          <button type="button" onClick={openSource} className={styles.link}>{change.source_type.replace('_', ' ')}</button>
        ) : (
          change.source_type
        )}
      </td>
      <td className={styles.cell}>{change.reason || '—'}</td>
      <td className={styles.cell}><span className={STATUS_BADGE[change.status]}>{change.status}</span></td>
      <td className={styles.cellMuted}>{change.role_keys.join(', ') || 'all'}</td>
    </tr>
  );
};

const styles = {
  row: `hover:bg-gray-50 align-top`,
  cell: `px-3 py-2 text-xs text-gray-900 border-b border-gray-200`,
  cellMuted: `px-3 py-2 text-xs text-gray-600 border-b border-gray-200 whitespace-nowrap`,
  key: `font-mono text-[11px]`,
  link: `text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer text-xs`,
};
