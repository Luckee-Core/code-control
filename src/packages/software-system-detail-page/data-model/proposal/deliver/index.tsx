'use client';

import { useEffect } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { DeliveryTarget } from '@/api/data-model-deliveries';
import { useAppDispatch, useAppSelector } from '@/store';
import { DataModelDeliveryBuilderActions } from '@/store/builders';
import { deliverDataModelThunk, getDataModelDeliveriesThunk } from '@/store/thunks/data-model-deliveries';
import { Preview } from './preview';
import { TargetRow } from './target-row';

const EMPTY: DeliveryTarget[] = [];

/**
 * Approved version only: one pull request per repo (storage gets migrations + models; express
 * and web get the models), rendered by code from the approved tables.
 */
export const Deliver = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const targets = useAppSelector((state) => (selectedId ? state.dataModelDeliveries[selectedId] ?? EMPTY : EMPTY));
  const loadStatus = useAppSelector((state) => state.dataModelDeliveryBuilder.loadStatus);
  const loadError = useAppSelector((state) => state.dataModelDeliveryBuilder.loadError);
  const deliveringRole = useAppSelector((state) => state.dataModelDeliveryBuilder.deliveringRole);
  const deliverError = useAppSelector((state) => state.dataModelDeliveryBuilder.deliverError);
  const autoMerge = useAppSelector((state) => state.dataModelDeliveryBuilder.autoMerge);

  useEffect(() => {
    if (selectedId) void dispatch(getDataModelDeliveriesThunk());
  }, [dispatch, selectedId]);

  const deliverable = targets.filter((target) => target.repo && target.delivery?.status !== 'merged');

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Deliver to repos</h2>
          <p className={detailPageStyles.panelSubtitle}>
            Opens one pull request per repo. Storage gets the migrations, models and seed table list; API express and
            web get the same models. Files are rendered by code from the approved tables. Repos already merged for
            this version are skipped. Merging never runs migrations: apply them in the storage repo afterwards.
          </p>
        </div>
        <div className={styles.headerActions}>
          <label className={styles.autoMerge}>
            <input
              type="checkbox"
              checked={autoMerge}
              onChange={(event) => dispatch(DataModelDeliveryBuilderActions.setAutoMerge(event.target.checked))}
              className={styles.checkbox}
            />
            Merge automatically
          </label>
          <button
            type="button"
            onClick={() => void dispatch(deliverDataModelThunk())}
            disabled={deliveringRole !== '' || deliverable.length === 0}
            className={detailPageStyles.primaryButton}
          >
            {deliveringRole === 'all'
              ? autoMerge
                ? 'Opening and merging…'
                : 'Opening PRs…'
              : deliverable.length === 0 && targets.some((target) => target.delivery?.status === 'merged')
                ? 'All merged'
                : autoMerge
                  ? 'Open and merge all'
                  : 'Open all PRs'}
          </button>
        </div>
      </div>
      {loadError ? <p className={styles.error}>{loadError}</p> : null}
      {deliverError ? <p className={styles.error}>{deliverError}</p> : null}
      {targets.length === 0 ? (
        <p className={styles.empty}>{loadStatus === 'loading' ? 'Loading…' : 'No delivery targets.'}</p>
      ) : (
        <ul className={styles.list}>
          {targets.map((target) => (
            <TargetRow key={target.role} target={target} />
          ))}
        </ul>
      )}
      <Preview />
    </section>
  );
};

const styles = {
  headerActions: `flex items-center gap-3 shrink-0`,
  autoMerge: `inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none`,
  checkbox: `h-3.5 w-3.5 cursor-pointer`,
  list: `divide-y divide-gray-200`,
  empty: `px-4 py-4 text-xs text-gray-500`,
  error: `mx-4 mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 whitespace-pre-wrap`,
};
