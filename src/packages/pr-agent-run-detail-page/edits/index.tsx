'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { DiffView, Findings } from '@/components/agent-runs';
import type { AgentRunFinding, PrAgentEdit } from '@/model/agent-run';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';

type EditsProps = { edits: PrAgentEdit[]; findings: AgentRunFinding[]; notes: string[]; omitted: string[] };

/** The PR agent's proposed edits: file list, diff per file, explanation, checks. */
export const Edits = ({ edits, findings, notes, omitted }: EditsProps) => {
  const dispatch = useAppDispatch();
  const selectedPath = useAppSelector((state) => state.agentRunsBuilder.selectedPath);
  const selected = useMemo(() => edits.find((edit) => edit.path === selectedPath) ?? edits[0] ?? null, [edits, selectedPath]);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Proposed changes to the PR</h2>
          <p className={detailPageStyles.panelSubtitle}>{edits.length} file{edits.length === 1 ? '' : 's'}. Nothing is committed until you approve.</p>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.split}>
          <ul className={styles.files}>
            {edits.map((edit) => (
              <li key={edit.path}>
                <button
                  type="button"
                  onClick={() => dispatch(AgentRunsBuilderActions.selectPath(edit.path))}
                  className={selected?.path === edit.path ? styles.fileActive : styles.file}
                >
                  <span className={styles.tag}>{edit.before_content === null ? 'new' : 'edit'}</span>
                  {edit.path}
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.viewer}>
            {selected ? (
              <>
                {selected.explanation ? <p className={styles.explanation}>{selected.explanation}</p> : null}
                <DiffView before={selected.before_content ?? ''} after={selected.after_content} />
              </>
            ) : (
              <p className={styles.empty}>No edits.</p>
            )}
          </div>
        </div>
        <div>
          <p className={detailPageStyles.sectionTitle}>Checks</p>
          <Findings findings={findings} />
        </div>
        {notes.length > 0 || omitted.length > 0 ? (
          <div>
            <p className={detailPageStyles.sectionTitle}>Agent notes</p>
            <ul className={styles.notes}>
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
              {omitted.length > 0 ? <li>Left out of the prompt for size: {omitted.join(', ')}</li> : null}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-3 flex flex-col gap-4`,
  split: `grid grid-cols-1 lg:grid-cols-[24rem_1fr] gap-3`,
  files: `flex flex-col gap-0.5 max-h-[36rem] overflow-auto`,
  file: `w-full text-left text-[11px] font-mono px-2 py-1 rounded hover:bg-gray-50 cursor-pointer break-all flex gap-2`,
  fileActive: `w-full text-left text-[11px] font-mono px-2 py-1 rounded bg-gray-100 ring-1 ring-inset ring-gray-300 break-all flex gap-2`,
  tag: `text-[9px] uppercase font-semibold text-gray-500 shrink-0`,
  viewer: `flex flex-col gap-2 min-w-0`,
  explanation: `text-xs text-gray-700`,
  empty: `text-xs text-gray-500`,
  notes: `list-disc pl-5 text-xs text-gray-700 flex flex-col gap-1`,
};
