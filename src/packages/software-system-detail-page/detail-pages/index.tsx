'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { getDataModelProposalsThunk } from '@/store/thunks/data-model-proposals';
import { Deliver } from '../data-model/proposal/deliver';
import { DeliveryAiCalls } from '../delivery-ai-calls';
import { DeliveryScreenshot } from '../delivery-screenshot';
import { buildDetailPlan } from './build-detail-plan';

const PAGE_PARTS = [
  { name: 'Route + package', detail: '/{thing}-detail-page renders src/packages/{thing}-detail-page; list rows open it' },
  { name: 'Summary panel', detail: 'title, every field read-only, parent links, ID · Created · Updated, ⋮ Edit / Delete' },
  { name: 'Edit modal', detail: 'zero-prop modal, one input per field, save thunk with no arguments' },
  { name: 'Related tabs', detail: 'one tab per related table with counts; rows open their own detail page' },
];

/**
 * Detail pages tab: one detail page per table (summary, edit modal, related-data tabs) generated
 * for the approved data model, delivered as one PR to the web repo, plus the AI calls on that PR.
 */
export const DetailPages = () => {
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
  const plan = useMemo(() => (approved?.proposal ? buildDetailPlan(approved.proposal.tables) : []), [approved]);

  if (!softwareSystemId) return null;

  if (!approved?.proposal) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{isLoading ? 'Loading…' : 'No approved data model yet'}</p>
          <p className={styles.emptyText}>
            Approve a version in the <strong>Data model</strong> tab. This tab then generates a detail page per table with a
            summary panel, an edit modal and a tab for each related table.
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
            <h2 className={detailPageStyles.panelTitle}>Detail pages for data model v{approved.version}</h2>
            <p className={detailPageStyles.panelSubtitle}>
              Follows the Web detail pages conventions. Every file is created only when missing, so edit the panels,
              fields and tabs freely.
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
                <th className={styles.th}>Detail page</th>
                <th className={styles.th}>Editable fields</th>
                <th className={styles.th}>Related tabs</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((row) => (
                <tr key={row.table} className={styles.row}>
                  <td className={styles.tdName}>{row.table}</td>
                  {row.isJoin ? (
                    <td className={styles.tdMuted} colSpan={3}>
                      Join table: no detail page (shown as a tab on both sides)
                    </td>
                  ) : (
                    <>
                      <td className={styles.tdPath}>{row.route}</td>
                      <td className={styles.tdPath}>{row.editable}</td>
                      <td className={styles.tdPath}>{row.tabs.join(', ') || '—'}</td>
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
        kind="detail"
        subtitle="A detail page inside the app shell with its real fields and related tabs (values are placeholders). The same screenshot goes in the detail pages PR."
        alt="Generated detail page: summary panel above related-data tabs"
      />
      <Deliver proposalId={approved.id} kind="detail" />
      <DeliveryAiCalls kind="detail" area="Detail pages" />
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
