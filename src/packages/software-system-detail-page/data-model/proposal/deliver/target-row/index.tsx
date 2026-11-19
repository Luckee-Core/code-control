'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { DeliveryTarget } from '@/api/data-model-deliveries';
import type { DataModelDeliveryStatus } from '@/model/data-model-delivery';
import { useAppDispatch, useAppSelector } from '@/store';
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

type TargetRowProps = { target: DeliveryTarget };

export const TargetRow = ({ target }: TargetRowProps) => {
  const dispatch = useAppDispatch();
  const deliveringRole = useAppSelector((state) => state.dataModelDeliveryBuilder.deliveringRole);
  const autoMerge = useAppSelector((state) => state.dataModelDeliveryBuilder.autoMerge);
  const { role, repo, delivery } = target;
  const isBusy = deliveringRole !== '';

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
        {delivery?.error ? (
          <p className={delivery.status === 'failed' ? styles.error : styles.note}>{delivery.error}</p>
        ) : null}
      </div>
      {repo ? (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => void dispatch(openDeliveryPreviewThunk(role))}
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
          {delivery?.status !== 'merged' ? (
            <button
              type="button"
              onClick={() => void dispatch(deliverDataModelThunk(role))}
              disabled={isBusy}
              className={`${detailPageStyles.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {deliveringRole === role
                ? 'Working…'
                : delivery?.pr_number
                  ? autoMerge
                    ? 'Update and merge'
                    : 'Update PR'
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
};
