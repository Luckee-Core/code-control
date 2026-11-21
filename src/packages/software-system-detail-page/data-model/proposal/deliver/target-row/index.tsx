'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PILL, StatusBadge } from '@/components/agent-runs';
import { detailPageStyles } from '@/components/detail-page-styles';
import { PR_AGENT_RUN_DETAIL_PAGE_PATH } from '@/config/routes';
import type { DeliveryTarget } from '@/api/data-model-deliveries';
import type { DataModelDeliveryKind, DataModelDeliveryStatus } from '@/model/data-model-delivery';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { openAgentRunThunk } from '@/store/thunks/agent-runs';
import {
  deliverDataModelThunk,
  openDeliveryPreviewThunk,
  refreshDataModelDeliveryThunk,
} from '@/store/thunks/data-model-deliveries';

const ROLE_LABEL = { storage: 'Storage', express: 'API express', web: 'Web' } as const;

const BADGE = 'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border';
const STATUS_BADGE: Record<DataModelDeliveryStatus, string> = {
  pending: `${BADGE} bg-blue-50 text-blue-700 border-blue-200`,
  opened: `${BADGE} bg-amber-50 text-amber-800 border-amber-200`,
  merged: `${BADGE} bg-green-50 text-green-700 border-green-200`,
  closed: `${BADGE} bg-gray-50 text-gray-500 border-gray-200`,
  failed: `${BADGE} bg-red-50 text-red-700 border-red-200`,
};
const STATUS_LABEL: Record<DataModelDeliveryStatus, string> = {
  pending: 'Working',
  opened: 'PR open',
  merged: 'Merged',
  closed: 'Closed',
  failed: 'Failed',
};

type TargetRowProps = { target: DeliveryTarget; proposalId: string; kind: DataModelDeliveryKind };

export const TargetRow = ({ target, proposalId, kind }: TargetRowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deliveringRole = useAppSelector((state) => state.dataModelDeliveryBuilder.deliveringRole);
  const autoMerge = useAppSelector((state) => state.dataModelDeliveryBuilder.autoMerge);
  const agentRuns = useAppSelector((state) => state.agentRuns);
  const templateHeads = useAppSelector((state) => state.templateHeads);
  const { role, repo, delivery } = target;
  const isBusy = deliveringRole !== '';

  const latestRun = useMemo(
    () =>
      delivery
        ? Object.values(agentRuns)
            .filter((run) => run.agent === 'pr' && run.delivery_id === delivery.id)
            .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null
        : null,
    [agentRuns, delivery],
  );
  const templateHead = templateHeads[role];
  const templatesBehind = Boolean(delivery?.pr_number && templateHead?.sha && delivery.template_sha !== templateHead.sha);
  const prOpen = Boolean(delivery?.pr_number && delivery.status === 'opened');

  return (
    <li className={styles.row}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span className={styles.role}>{ROLE_LABEL[role]}</span>
          {delivery ? <span className={STATUS_BADGE[delivery.status]}>{STATUS_LABEL[delivery.status]}</span> : null}
        </div>
        {repo ? (
          <a href={repo.repo_url} target="_blank" rel="noopener noreferrer" className={styles.repo}>
            {repo.name}
          </a>
        ) : (
          <p className={styles.missing}>
            No {ROLE_LABEL[role].toLowerCase()} repo yet. Create it (or set a repo&apos;s role) in the Repositories tab.
          </p>
        )}
        {delivery?.pr_url ? (
          <a href={delivery.pr_url} target="_blank" rel="noopener noreferrer" className={styles.pr}>
            PR #{delivery.pr_number} · {delivery.files.length} files · {delivery.branch}
          </a>
        ) : null}
        {latestRun ? (
          <div className={styles.agentRow}>
            <span className={styles.agentLabel}>PR agent</span>
            <StatusBadge status={latestRun.status} />
            <button
              type="button"
              className={styles.agentLink}
              onClick={() => {
                void dispatch(openAgentRunThunk(latestRun));
                router.push(PR_AGENT_RUN_DETAIL_PAGE_PATH);
              }}
            >
              {latestRun.title || 'View run'}
            </button>
          </div>
        ) : null}
        {delivery?.convergence ? (
          <span
            className={delivery.convergence === 'converged' ? `${PILL} self-start bg-green-50 text-green-700 border-green-200` : `${PILL} self-start bg-amber-50 text-amber-800 border-amber-200`}
            title={delivery.convergence_detail?.differing_paths.join(', ') || undefined}
          >
            {delivery.convergence === 'converged' ? 'Templates reproduce the PR fix' : `Templates differ in ${delivery.convergence_detail?.differing_paths.length ?? 0} file(s)`}
          </span>
        ) : null}
        {templatesBehind ? <p className={styles.note}>Templates changed since this PR was rendered. Re-render to pick them up (PR agent edits on the branch are replaced).</p> : null}
        {delivery?.error ? (
          <p className={delivery.status === 'failed' ? styles.error : styles.note}>{delivery.error}</p>
        ) : null}
      </div>
      {repo ? (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => void dispatch(openDeliveryPreviewThunk(proposalId, kind, role))}
            className={detailPageStyles.secondaryButton}
          >
            Preview files
          </button>
          {delivery?.pr_number ? (
            <button
              type="button"
              onClick={() => void dispatch(refreshDataModelDeliveryThunk(delivery.id))}
              className={detailPageStyles.secondaryButton}
            >
              Refresh
            </button>
          ) : null}
          {prOpen && delivery ? (
            <button
              type="button"
              onClick={() => dispatch(AgentRunsBuilderActions.openUpdatePr(delivery.id))}
              disabled={isBusy}
              className={`${detailPageStyles.primaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Give feedback: the PR agent proposes edits to this PR"
            >
              Update PR
            </button>
          ) : null}
          {delivery?.status !== 'merged' || kind === 'layout' ? (
            <button
              type="button"
              onClick={() => void dispatch(deliverDataModelThunk(proposalId, kind, role))}
              disabled={isBusy}
              className={`${detailPageStyles.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
              title={delivery?.pr_number ? 'Render again from the templates and replace the PR branch' : undefined}
            >
              {deliveringRole === role
                ? 'Working…'
                : delivery?.status === 'merged'
                  ? 'Deliver again'
                  : delivery?.pr_number
                  ? autoMerge
                    ? 'Re-render and merge'
                    : templatesBehind
                      ? 'Re-render (templates changed)'
                      : 'Re-render'
                  : autoMerge
                    ? 'Open and merge'
                    : 'Open PR'}
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
};

const styles = {
  row: `px-4 py-3 flex flex-wrap items-start justify-between gap-3`,
  main: `flex flex-col gap-1 min-w-0`,
  top: `flex items-center gap-2`,
  role: `text-xs font-semibold text-gray-900`,
  repo: `text-xs font-mono text-blue-600 hover:underline truncate`,
  pr: `text-[11px] text-blue-600 hover:underline`,
  missing: `text-[11px] text-gray-500`,
  error: `text-[11px] text-red-700 whitespace-pre-wrap`,
  note: `text-[11px] text-amber-800 whitespace-pre-wrap`,
  actions: `flex items-center gap-2 shrink-0`,
  agentRow: `flex items-center gap-2 mt-0.5`,
  agentLabel: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  agentLink: `text-[11px] text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer truncate max-w-xs text-left`,
};
