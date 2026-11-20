'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PR_AGENT_RUN_DETAIL_PAGE_PATH } from '@/config/routes';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { createPrAgentRunThunk } from '@/store/thunks/agent-runs';
import { FeedbackInput } from './inputs/feedback';
import { FocusFilesInput } from './inputs/focus-files';

/**
 * Update PR: feedback on one delivery's PR → a PR agent run (saved as a draft, or run now).
 * Opens the run's page afterwards.
 */
export const UpdatePrModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.agentRunsBuilder.updatePr);
  const deliveries = useAppSelector((state) => state.dataModelDeliveries);
  const delivery = useMemo(
    () => Object.values(deliveries).flat().find((target) => target.delivery?.id === modal.deliveryId)?.delivery ?? null,
    [deliveries, modal.deliveryId],
  );
  if (!modal.open || !delivery) return null;

  const busy = modal.status === 'loading';
  const submit = async (runNow: boolean) => {
    const status = await dispatch(createPrAgentRunThunk(runNow));
    if (status === 200) router.push(PR_AGENT_RUN_DETAIL_PAGE_PATH);
  };
  const close = () => dispatch(AgentRunsBuilderActions.closeUpdatePr());

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-label="Update PR">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Update PR #{delivery.pr_number}</h2>
            <p className={styles.subtitle}>{delivery.repo_full_name} · {delivery.role} · {delivery.branch}</p>
          </div>
          <button type="button" onClick={close} className={styles.close} aria-label="Close">×</button>
        </div>
        <div className={styles.content}>
          <FeedbackInput />
          <FocusFilesInput files={delivery.files} />
          {modal.error ? <p className={styles.error}>{modal.error}</p> : null}
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={close} className={styles.cancel}>Cancel</button>
          <button type="button" onClick={() => void submit(false)} disabled={busy || !modal.feedback.trim()} className={styles.secondary}>
            Save draft
          </button>
          <button type="button" onClick={() => void submit(true)} disabled={busy || !modal.feedback.trim()} className={styles.primary}>
            {busy ? 'Starting…' : 'Run PR agent'}
          </button>
        </div>
      </div>
    </div>
  );
};

const button = `text-xs font-medium px-3 py-1.5 rounded border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`;
const styles = {
  overlay: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`,
  modal: `bg-white rounded-lg shadow-xl max-w-2xl w-full border border-gray-300 overflow-hidden text-gray-900 max-h-[90vh] flex flex-col`,
  header: `flex items-start justify-between px-6 py-4 border-b border-gray-300`,
  title: `text-sm font-semibold`,
  subtitle: `text-xs text-gray-500 mt-0.5 font-mono`,
  close: `text-gray-500 hover:text-gray-900 text-xl leading-none cursor-pointer`,
  content: `px-6 py-4 flex flex-col gap-4 overflow-y-auto`,
  error: `text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
  footer: `flex justify-end gap-2 px-6 py-3 border-t border-gray-300 bg-gray-50`,
  cancel: `${button} border-transparent text-gray-600 hover:text-gray-900`,
  secondary: `${button} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`,
  primary: `${button} border-gray-900 bg-gray-900 text-white hover:bg-gray-800`,
};
