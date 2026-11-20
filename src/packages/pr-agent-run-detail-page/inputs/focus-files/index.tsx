'use client';

import { useMemo, useState } from 'react';
import { agentFormStyles } from '@/components/agent-runs';
import type { DataModelDeliveryFile } from '@/model/data-model-delivery';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';

type FocusFilesInputProps = { files: DataModelDeliveryFile[] };

/** PR files the agent should look at first (optional). */
export const FocusFilesInput = ({ files }: FocusFilesInputProps) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.agentRunsBuilder.draftFocusPaths);
  const [filter, setFilter] = useState('');
  const visible = useMemo(() => files.filter((file) => file.path.toLowerCase().includes(filter.toLowerCase())).slice(0, 200), [files, filter]);
  return (
    <div className={agentFormStyles.field}>
      <span className={agentFormStyles.label}>Focus files ({selected.length} selected)</span>
      <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter PR files" className={styles.filter} />
      <ul className={styles.list}>
        {visible.map((file) => (
          <li key={file.path}>
            <label className={styles.item}>
              <input type="checkbox" checked={selected.includes(file.path)} onChange={() => dispatch(AgentRunsBuilderActions.toggleDraftFocusPath(file.path))} />
              <span className={styles.path}>{file.path}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  filter: `h-7 text-xs border border-gray-300 rounded px-2 w-full max-w-sm`,
  list: `max-h-48 overflow-auto border border-gray-200 rounded divide-y divide-gray-100`,
  item: `flex items-center gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-gray-50`,
  path: `font-mono text-[11px] text-gray-800`,
};
