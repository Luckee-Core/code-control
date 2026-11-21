'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PILL, StatusBadge } from '@/components/agent-runs';
import { PR_AGENT_RUN_DETAIL_PAGE_PATH } from '@/config/routes';
import type { DeliveryTarget } from '@/api/data-model-deliveries';
import type { DataModelDeliveryKind, DataModelDeliveryStatus } from '@/model/data-model-delivery';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { openAgentRunThunk } from '@/store/thunks/agent-runs';
import {
  deliverDataModelThunk,
  mergeDataModelDeliveryThunk,
  mergingRoleKey,
  openDeliveryPreviewThunk,
  refreshDataModelDeliveryThunk,
} from '@/store/thunks/data-model-deliveries';
import { ActionsMenu, type TargetAction } from './actions-menu';

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

/** One repo's delivery as a table row: repo, status, pull request (agent run, notes) and the actions menu. */
export const TargetRow = ({ target, proposalId, kind }: TargetRowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deliveringRole = useAppSelector((state) => state.dataModelDeliveryBuilder.deliveringRole);
  const autoMerge = useAppSelector((state) => state.dataModelDeliveryBuilder.autoMerge);
  const agentRuns = useAppSelector((state) => state.agentRuns);
  const templateHeads = useAppSelector((state) => state.templateHeads);
  const { role, repo, delivery } = target;
  const isBusy = deliveringRole !== '';
  const rowBusy = deliveringRole === role || deliveringRole === mergingRoleKey(role) || deliveringRole === 'all';

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

  const deliverLabel =
    delivery?.status === 'merged'
      ? 'Deliver again'
      : delivery?.pr_number
        ? autoMerge
          ? 'Re-render and merge'
          : templatesBehind
            ? 'Re-render (templates changed)'
            : 'Re-render'
        : autoMerge
          ? 'Open and merge'
          : 'Open PR';

  const actions: TargetAction[] = [];
  if (repo) {
    if (prOpen && delivery) {
      actions.push({
        key: 'merge',
        label: `Merge PR #${delivery.pr_number}`,
        icon: 'merge',
        disabled: isBusy,
        title: 'Squash-merge on GitHub and delete the branch',
        onSelect: () => {
          if (!confirm(`Squash-merge PR #${delivery.pr_number} into ${delivery.base_branch || 'the default branch'} of ${repo.name}?`)) return;
          void dispatch(mergeDataModelDeliveryThunk(delivery.id, role));
        },
      });
      actions.push({
        key: 'update',
        label: 'Update PR',
        icon: 'update',
        disabled: isBusy,
        title: 'Give feedback: the PR agent proposes edits to this PR',
        onSelect: () => dispatch(AgentRunsBuilderActions.openUpdatePr(delivery.id)),
      });
    }
    if (delivery?.status !== 'merged' || kind === 'layout' || kind === 'list' || kind === 'detail' || kind === 'dashboard') {
      actions.push({
        key: 'deliver',
        label: deliverLabel,
        icon: 'deliver',
        disabled: isBusy,
        title: delivery?.pr_number ? 'Render again from the templates and replace the PR branch' : undefined,
        onSelect: () => void dispatch(deliverDataModelThunk(proposalId, kind, role)),
      });
    }
    actions.push({
      key: 'preview',
      label: 'Preview files',
      icon: 'preview',
      onSelect: () => void dispatch(openDeliveryPreviewThunk(proposalId, kind, role)),
    });
    if (delivery?.pr_number) {
      actions.push({
        key: 'refresh',
        label: 'Refresh status',
        icon: 'refresh',
        disabled: isBusy,
        onSelect: () => void dispatch(refreshDataModelDeliveryThunk(delivery.id)),
      });
    }
    if (delivery?.pr_url) {
      const prUrl = delivery.pr_url;
      actions.push({ key: 'github', label: 'Open on GitHub', icon: 'github', onSelect: () => window.open(prUrl, '_blank', 'noopener,noreferrer') });
    }
  }

  const statusLabel =
    deliveringRole === mergingRoleKey(role) ? 'Merging…' : deliveringRole === role ? 'Working…' : delivery ? STATUS_LABEL[delivery.status] : null;

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <div className={styles.stack}>
          <span className={styles.role}>{ROLE_LABEL[role]}</span>
          {repo ? (
            <a href={repo.repo_url} target="_blank" rel="noopener noreferrer" className={styles.repo} title={repo.name}>
              {repo.name}
            </a>
          ) : (
            <span className={styles.muted}>No repo yet</span>
          )}
        </div>
      </td>
      <td className={styles.cell}>
        {statusLabel ? (
          <span className={delivery && !rowBusy ? STATUS_BADGE[delivery.status] : STATUS_BADGE.pending}>{statusLabel}</span>
        ) : (
          <span className={styles.muted}>Not delivered</span>
        )}
      </td>
      <td className={styles.cell}>
        <div className={styles.stack}>
          {!repo ? (
            <span className={styles.muted}>Create it (or set a repo&apos;s role) in the Repositories tab.</span>
          ) : delivery?.pr_url ? (
            <>
              <a href={delivery.pr_url} target="_blank" rel="noopener noreferrer" className={styles.pr}>
                #{delivery.pr_number}
              </a>
              <span className={styles.meta} title={delivery.branch}>
                {delivery.files.length} files · {delivery.branch}
              </span>
            </>
          ) : (
            <span className={styles.muted}>—</span>
          )}
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
              className={
                delivery.convergence === 'converged'
                  ? `${PILL} self-start bg-green-50 text-green-700 border-green-200`
                  : `${PILL} self-start bg-amber-50 text-amber-800 border-amber-200`
              }
              title={delivery.convergence_detail?.differing_paths.join(', ') || undefined}
            >
              {delivery.convergence === 'converged'
                ? 'Templates reproduce the PR fix'
                : `Templates differ in ${delivery.convergence_detail?.differing_paths.length ?? 0} file(s)`}
            </span>
          ) : null}
          {templatesBehind && delivery?.status !== 'merged' ? (
            <span className={styles.note}>Templates changed since this PR was rendered. Re-render to pick them up.</span>
          ) : null}
          {delivery?.error ? (
            <span className={delivery.status === 'failed' ? styles.error : styles.note}>{delivery.error}</span>
          ) : null}
        </div>
      </td>
      <td className={styles.cellActions}>
        <ActionsMenu label={`${ROLE_LABEL[role]} delivery`} actions={actions} busy={rowBusy} />
      </td>
    </tr>
  );
};

const styles = {
  row: `border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors align-top`,
  cell: `px-3 py-2 text-xs text-gray-900`,
  cellActions: `px-2 py-1.5 w-12`,
  stack: `flex flex-col gap-1 min-w-0`,
  role: `text-xs font-semibold text-gray-900`,
  repo: `text-[11px] font-mono text-blue-600 hover:underline truncate`,
  pr: `text-xs font-medium text-blue-600 hover:underline self-start`,
  meta: `text-[11px] text-gray-500 font-mono truncate`,
  muted: `text-[11px] text-gray-500`,
  error: `text-[11px] text-red-700 whitespace-pre-wrap`,
  note: `text-[11px] text-amber-800 whitespace-pre-wrap`,
  agentRow: `flex items-center gap-2`,
  agentLabel: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  agentLink: `text-[11px] text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer truncate max-w-xs text-left`,
};
