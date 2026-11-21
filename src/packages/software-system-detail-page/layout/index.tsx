'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { getDataModelProposalsThunk } from '@/store/thunks/data-model-proposals';
import { Deliver } from '../data-model/proposal/deliver';
import { DeliveryAiCalls } from '../delivery-ai-calls';
import { Screenshot } from './screenshot';

const SHELL_PARTS = [
  { name: 'AppLayout', detail: 'src/app/(app)/layout.tsx wraps every app screen once' },
  { name: 'Sidebar', detail: 'brand + links from getNavigationLinks()' },
  { name: 'Breadcrumb header', detail: 'sidebar toggle, active nav link, then the screen’s Redux trail' },
  { name: 'Routes', detail: 'src/config/routes.ts: list and static detail-page paths per table' },
];

/**
 * Layout tab: the web app shell (sidebar, breadcrumb header, routes) generated for the approved
 * data model, delivered as one PR to the web repo, plus the AI calls on that PR.
 */
export const Layout = () => {
  const dispatch = useAppDispatch();
  const softwareSystemId = useAppSelector((state) => state.currentSoftwareSystem.id);
  const loadedFor = useAppSelector((state) => state.dataModelBuilder.softwareSystemId);
  const isLoading = useAppSelector((state) => state.dataModelBuilder.isLoading);
  const proposalsById = useAppSelector((state) => state.dataModelProposals);

  useEffect(() => {
    if (softwareSystemId && loadedFor !== softwareSystemId) void dispatch(getDataModelProposalsThunk());
  }, [dispatch, softwareSystemId, loadedFor]);

  const approved = useMemo(
    () =>
      Object.values(proposalsById).find(
        (proposal) => proposal.software_system_id === softwareSystemId && proposal.status === 'approved' && proposal.proposal,
      ),
    [proposalsById, softwareSystemId],
  );

  if (!softwareSystemId) return null;

  if (!approved?.proposal) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{isLoading ? 'Loading…' : 'No approved data model yet'}</p>
          <p className={styles.emptyText}>
            Approve a version in the <strong>Data model</strong> tab. This tab then generates the web app shell: a left
            sidebar, the breadcrumb header and a route for every table.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className={styles.stack}>
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <div>
            <h2 className={detailPageStyles.panelTitle}>App shell for data model v{approved.version}</h2>
            <p className={detailPageStyles.panelSubtitle}>
              Follows the Web app layout conventions. A table shows in the sidebar once its list page exists in the web
              repo; until then the sidebar stays empty. No placeholder pages are added.
            </p>
          </div>
        </div>
        <ul className={styles.parts}>
          {SHELL_PARTS.map((part) => (
            <li key={part.name} className={styles.part}>
              <span className={styles.partName}>{part.name}</span>
              <span className={styles.partDetail}>{part.detail}</span>
            </li>
          ))}
        </ul>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Table</th>
                <th className={styles.th}>List page</th>
                <th className={styles.th}>Detail page</th>
              </tr>
            </thead>
            <tbody>
              {approved.proposal.tables.map((table) => (
                <tr key={table.name} className={styles.row}>
                  <td className={styles.tdName}>{table.name}</td>
                  <td className={styles.tdPath}>/{table.name.replace(/_/g, '-')}</td>
                  <td className={styles.tdPath}>/{table.entity.replace(/_/g, '-')}-detail-page</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Screenshot proposalId={approved.id} />
      <Deliver proposalId={approved.id} kind="layout" />
      <DeliveryAiCalls kind="layout" area="Layout" />
    </div>
  );
};

const styles = {
  stack: `flex flex-col gap-5`,
  empty: `px-6 py-10 flex flex-col gap-2 max-w-xl`,
  emptyTitle: `text-sm font-semibold text-gray-900`,
  emptyText: `text-xs text-gray-600 leading-relaxed`,
  parts: `px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 border-b border-gray-200`,
  part: `flex flex-col text-xs`,
  partName: `font-medium text-gray-900`,
  partDetail: `text-gray-500`,
  tableWrap: `overflow-x-auto`,
  table: `w-full text-xs`,
  th: `px-4 py-2 text-left font-medium text-gray-500 bg-gray-50 border-b border-gray-200`,
  row: `border-b border-gray-100 last:border-b-0`,
  tdName: `px-4 py-1.5 font-mono text-gray-900`,
  tdPath: `px-4 py-1.5 font-mono text-[11px] text-gray-500`,
};
