'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { getDataModelProposalsThunk } from '@/store/thunks/data-model-proposals';
import { Deliver } from '../data-model/proposal/deliver';
import { DeliveryAiCalls } from '../delivery-ai-calls';
import { DeliveryScreenshot } from '../delivery-screenshot';
import { buildDashboardPlan } from './build-dashboard-plan';

const PAGE_PARTS = [
  { name: 'Route + redirect', detail: '/dashboard in the (app) shell; / redirects to it unless the root page was customized' },
  { name: 'Sidebar', detail: 'Dashboard becomes the first link (DASHBOARD_PATH in src/config/routes.ts)' },
  { name: 'Summary cards', detail: 'one per table: row count, active vs archived, counts per value of the first enum column' },
  { name: 'Recent activity', detail: 'latest rows across tables by updated_at; opens detail pages where they exist' },
];

/**
 * Dashboard tab: the web app's home screen (summary card per table, recent activity, root
 * redirect) generated for the approved data model, delivered as one PR to the web repo, plus the
 * AI calls on that PR.
 */
export const Dashboard = () => {
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
  const plan = useMemo(() => (approved?.proposal ? buildDashboardPlan(approved.proposal.tables) : []), [approved]);

  if (!softwareSystemId) return null;

  if (!approved?.proposal) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{isLoading ? 'Loading…' : 'No approved data model yet'}</p>
          <p className={styles.emptyText}>
            Approve a version in the <strong>Data model</strong> tab. This tab then generates the app&apos;s home screen: a
            summary card per table and recent activity across tables, with <code>/</code> opening it.
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
            <h2 className={detailPageStyles.panelTitle}>Dashboard for data model v{approved.version}</h2>
            <p className={detailPageStyles.panelSubtitle}>
              Follows the Web dashboard conventions. Cards and recent activity are regenerated on every delivery; the card
              component and page header are created once, so restyle them freely.
            </p>
          </div>
        </div>
        <ul className={styles.parts}>
          {PAGE_PARTS.map((part) => (
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
                <th className={styles.th}>Active split</th>
                <th className={styles.th}>Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((row) => (
                <tr key={row.table} className={styles.row}>
                  <td className={styles.tdName}>{row.table}</td>
                  {row.isJoin ? (
                    <td className={styles.tdMuted} colSpan={2}>
                      Join table: no card
                    </td>
                  ) : (
                    <>
                      <td className={styles.tdPath}>{row.activeSplit ? 'is_active' : '—'}</td>
                      <td className={styles.tdPath}>{row.breakdown || '—'}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <DeliveryScreenshot
        proposalId={approved.id}
        kind="dashboard"
        subtitle="The home screen inside the app shell with a card for every table (counts are placeholders). The same screenshot goes in the dashboard PR."
        alt="Generated dashboard: summary cards above recent activity"
      />
      <Deliver proposalId={approved.id} kind="dashboard" />
      <DeliveryAiCalls kind="dashboard" area="Dashboard" />
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
  tdMuted: `px-4 py-1.5 text-[11px] text-gray-500 italic`,
};
