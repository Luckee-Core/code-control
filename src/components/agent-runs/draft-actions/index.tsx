'use client';

import type { ReactNode } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { confirmAgentRunThunk, dismissAgentRunThunk, saveAgentRunDraftThunk } from '@/store/thunks/agent-runs';
import { InstructionsInput } from '../forms/instructions';

type DraftActionsProps = { title: string; description: string; children?: ReactNode; confirmDisabledReason?: string | null };

/**
 * A draft hasn't started: shows what the agent will work from (children), optional instructions,
 * and Confirm (run it) / Save / Dismiss.
 */
export const DraftActions = ({ title, description, children, confirmDisabledReason }: DraftActionsProps) => {
  const dispatch = useAppDispatch();
  const action = useAppSelector((state) => state.agentRunsBuilder.action);
  const busy = action !== '';
  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>{title}</h2>
          <p className={detailPageStyles.panelSubtitle}>{description}</p>
        </div>
      </div>
      <div className={styles.body}>
        {children}
        <InstructionsInput />
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => void dispatch(confirmAgentRunThunk())}
            disabled={busy || Boolean(confirmDisabledReason)}
            title={confirmDisabledReason ?? undefined}
            className={detailPageStyles.primaryButton}
          >
            {action === 'confirm' ? 'Starting…' : 'Confirm and run'}
          </button>
          <button type="button" onClick={() => void dispatch(saveAgentRunDraftThunk())} disabled={busy} className={detailPageStyles.secondaryButton}>
            {action === 'save' ? 'Saving…' : 'Save draft'}
          </button>
          <button type="button" onClick={() => void dispatch(dismissAgentRunThunk())} disabled={busy} className={styles.dismiss}>
            {action === 'dismiss' ? 'Dismissing…' : 'Dismiss'}
          </button>
          {confirmDisabledReason ? <span className={styles.hint}>{confirmDisabledReason}</span> : null}
        </div>
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-3 flex flex-col gap-3`,
  buttons: `flex flex-wrap items-center gap-2`,
  dismiss: `text-xs font-medium text-gray-500 px-3 py-1.5 rounded border border-transparent hover:text-gray-800 cursor-pointer disabled:opacity-50`,
  hint: `text-[11px] text-amber-800`,
};
