'use client';

import { useEffect } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { DeliveryTarget } from '@/api/data-model-deliveries';
import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import { useAppDispatch, useAppSelector } from '@/store';
import { DataModelDeliveryBuilderActions } from '@/store/builders';
import { deliveryTargetsKey } from '@/store/dumps';
import { deliverDataModelThunk, getDataModelDeliveriesThunk } from '@/store/thunks/data-model-deliveries';
import { getTemplateHeadsThunk, listAgentRunsThunk } from '@/store/thunks/agent-runs';
import { Preview } from './preview';
import { TargetRow } from './target-row';
import { UpdatePrModal } from './update-pr-modal';

const EMPTY: DeliveryTarget[] = [];

const COPY: Record<DataModelDeliveryKind, { title: string; subtitle: string }> = {
  model: {
    title: 'Deliver to repos',
    subtitle:
      'Opens one pull request per repo. Storage gets the migrations, models and seed table list; API express and web get the same models. Files are rendered by code from the approved tables. Repos already merged for this version are skipped. Merging never runs migrations: apply them in the storage repo afterwards.',
  },
  crud: {
    title: 'Data access (standard CRUD)',
    subtitle:
      'Opens one pull request per repo with the code that reads and writes these tables: storage CRUD functions + invoke registry; API express invoke wrappers, routers, handlers and process functions under /api/data/{table}; web src/api, dumps and thunks plus the /api/data proxy. Each repo needs its data model PR merged first. Repos already merged for this version are skipped.',
  },
  list: {
    title: 'List pages (web)',
    subtitle:
      'Opens one pull request on the web repo with a list page per table (join tables skipped): the route, a table with sortable headers, live search, enum and yes/no filters, the filters slice and list builder in Redux, and a sidebar link for each page. Needs the API and Layout PRs merged first. Files are only added when missing. Deliver again after adding tables to get their pages.',
  },
  layout: {
    title: 'App layout (web)',
    subtitle:
      'Opens one pull request on the web repo with the app shell: AppLayout in the (app) route group, the sidebar, the breadcrumb header and Redux trail, route constants for every table, and sidebar links for list pages that already exist. Shell files are only added when missing. Deliver again after adding pages: it adds their links, and does nothing when nothing changed.',
  },
};

type DeliverProps = { proposalId: string; kind: DataModelDeliveryKind };

/**
 * Approved version only: one pull request per repo for one kind of generated code
 * (model files, the CRUD layer or the web app layout), rendered by code from the approved tables.
 */
export const Deliver = ({ proposalId, kind }: DeliverProps) => {
  const dispatch = useAppDispatch();
  const targets = useAppSelector((state) => state.dataModelDeliveries[deliveryTargetsKey(proposalId, kind)] ?? EMPTY);
  const loadStatus = useAppSelector((state) => state.dataModelDeliveryBuilder.loadStatus);
  const loadError = useAppSelector((state) => state.dataModelDeliveryBuilder.loadError);
  const deliveringRole = useAppSelector((state) => state.dataModelDeliveryBuilder.deliveringRole);
  const deliverError = useAppSelector((state) => state.dataModelDeliveryBuilder.deliverError);
  const autoMerge = useAppSelector((state) => state.dataModelDeliveryBuilder.autoMerge);
  const softwareSystemId = useAppSelector((state) => state.currentSoftwareSystem.id);

  useEffect(() => {
    dispatch(DataModelDeliveryBuilderActions.closePreview());
    if (proposalId) void dispatch(getDataModelDeliveriesThunk(proposalId, kind));
  }, [dispatch, proposalId, kind]);

  // PR agent runs for this project (latest per PR) and template heads (Re-render when behind).
  useEffect(() => {
    if (!softwareSystemId) return;
    void dispatch(listAgentRunsThunk({ agent: 'pr', software_system_id: softwareSystemId }, true));
    void dispatch(getTemplateHeadsThunk());
  }, [dispatch, softwareSystemId]);

  // A merged layout or list-pages PR can be delivered again (new tables or pages since); other kinds are done once merged.
  const redeliverable = kind === 'layout' || kind === 'list';
  const deliverable = targets.filter((target) => target.repo && (redeliverable || target.delivery?.status !== 'merged'));
  const allMerged = targets.some((target) => target.repo) && targets.every((target) => !target.repo || target.delivery?.status === 'merged');

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>{COPY[kind].title}</h2>
          <p className={detailPageStyles.panelSubtitle}>{COPY[kind].subtitle}</p>
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
            onClick={() => void dispatch(deliverDataModelThunk(proposalId, kind))}
            disabled={deliveringRole !== '' || deliverable.length === 0}
            className={detailPageStyles.primaryButton}
          >
            {deliveringRole === 'all'
              ? autoMerge
                ? 'Opening and merging…'
                : 'Opening PRs…'
              : deliverable.length === 0 && targets.some((target) => target.delivery?.status === 'merged')
                ? 'All merged'
                : redeliverable && allMerged
                  ? 'Deliver again'
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
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thRepo}>Repository</th>
                <th className={styles.thStatus}>Status</th>
                <th className={styles.th}>Pull request</th>
                <th className={styles.thActions}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {targets.map((target) => (
                <TargetRow key={target.role} target={target} proposalId={proposalId} kind={kind} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Preview proposalId={proposalId} kind={kind} />
      <UpdatePrModal />
    </section>
  );
};

const styles = {
  headerActions: `flex items-center gap-3 shrink-0`,
  autoMerge: `inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none`,
  checkbox: `h-3.5 w-3.5 cursor-pointer`,
  tableWrapper: `mx-4 my-3 bg-white rounded border border-gray-300 overflow-x-auto`,
  table: `w-full text-left border-collapse text-xs table-fixed`,
  th: `px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300`,
  thRepo: `px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300 w-56`,
  thStatus: `px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300 w-28`,
  thActions: `px-2 py-2 bg-gray-100 border-b border-gray-300 w-12`,
  empty: `px-4 py-4 text-xs text-gray-500`,
  error: `mx-4 mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 whitespace-pre-wrap`,
};
