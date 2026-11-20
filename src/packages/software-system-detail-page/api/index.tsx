'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { getDataModelProposalsThunk } from '@/store/thunks/data-model-proposals';
import { Deliver } from '../data-model/proposal/deliver';
import { ApiAiCalls } from './ai-calls';

/**
 * API tab: the data-access layer for the approved data model (standard CRUD per table),
 * delivered as one PR per repo. An AI step for custom operations comes later.
 */
export const Api = () => {
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
            Approve a version in the <strong>Data model</strong> tab and merge its pull requests. This tab then generates
            the code that reads and writes those tables in storage, API express and web.
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
            <h2 className={detailPageStyles.panelTitle}>Data model v{approved.version}</h2>
            <p className={detailPageStyles.panelSubtitle}>
              {approved.proposal.tables.length} tables: each gets list, get by id, list by each foreign key, create, update
              and delete, following the seeded API services and web data conventions.
            </p>
          </div>
        </div>
        <ul className={styles.tables}>
          {approved.proposal.tables.map((table) => (
            <li key={table.name} className={styles.table}>
              <span className={styles.tableName}>{table.name}</span>
              <span className={styles.route}>/api/data/{table.name.replace(/_/g, '-')}</span>
            </li>
          ))}
        </ul>
      </section>
      <Deliver proposalId={approved.id} kind="crud" />
      <ApiAiCalls />
    </div>
  );
};

const styles = {
  stack: `flex flex-col gap-5`,
  empty: `px-6 py-10 flex flex-col gap-2 max-w-xl`,
  emptyTitle: `text-sm font-semibold text-gray-900`,
  emptyText: `text-xs text-gray-600 leading-relaxed`,
  tables: `px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1`,
  table: `flex items-baseline justify-between gap-3 text-xs`,
  tableName: `font-mono text-gray-900`,
  route: `font-mono text-[11px] text-gray-500`,
};
