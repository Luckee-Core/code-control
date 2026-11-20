'use client';

import { useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { DiffView } from '@/components/agent-runs';
import type { AgentRun, PrAgentEdit } from '@/model/agent-run';

type ContextProps = { prRun: AgentRun | null; edits: PrAgentEdit[] };

/** What the convention agent reads: the reviewer's feedback and the approved PR change. */
export const Context = ({ prRun, edits }: ContextProps) => {
  const [open, setOpen] = useState<string>('');
  if (!prRun) return null;
  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Approved PR change</h2>
          <p className={detailPageStyles.panelSubtitle}>{prRun.summary}</p>
        </div>
      </div>
      <div className={styles.body}>
        <p className={detailPageStyles.sectionTitle}>Reviewer feedback</p>
        <p className={styles.feedback}>{String(prRun.input.feedback ?? '')}</p>
        <p className={detailPageStyles.sectionTitle}>Files ({edits.length})</p>
        <ul className={styles.files}>
          {edits.map((edit) => (
            <li key={edit.path}>
              <button type="button" onClick={() => setOpen(open === edit.path ? '' : edit.path)} className={styles.file}>
                {open === edit.path ? '▾' : '▸'} {edit.path}
                {edit.after_content === null ? <span className={styles.deleted}> (deleted)</span> : null}
              </button>
              {open === edit.path ? <DiffView before={edit.before_content ?? ''} after={edit.after_content ?? ''} /> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-3 flex flex-col gap-2`,
  feedback: `text-xs text-gray-900 whitespace-pre-wrap`,
  files: `flex flex-col gap-1`,
  file: `text-left text-[11px] font-mono text-blue-700 hover:underline bg-transparent border-none p-0 cursor-pointer`,
  deleted: `text-red-600 font-sans`,
};
