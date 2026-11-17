'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectDataModelProposalThunk } from '@/store/thunks/data-model-proposals';
import { formatDate } from '@/utils/date-time';
import { STATUS_BADGE, STATUS_LABEL } from '../status-badge';

export const Versions = () => {
  const dispatch = useAppDispatch();
  const proposalsById = useAppSelector((state) => state.dataModelProposals);
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const isLoading = useAppSelector((state) => state.dataModelBuilder.isLoading);
  const loadError = useAppSelector((state) => state.dataModelBuilder.loadError);

  const proposals = useMemo(
    () => Object.values(proposalsById).sort((a, b) => b.version - a.version),
    [proposalsById],
  );

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Versions</h2>
          <p className={detailPageStyles.panelSubtitle}>Each generate or revise creates a new version.</p>
        </div>
      </div>
      {loadError ? <p className={styles.error}>{loadError}</p> : null}
      {proposals.length === 0 ? (
        <p className={styles.empty}>{isLoading ? 'Loading…' : 'No proposals yet.'}</p>
      ) : (
        <ul className={styles.list}>
          {proposals.map((proposal) => {
            const errors = proposal.warnings.filter((warning) => warning.severity === 'error').length;
            return (
              <li key={proposal.id}>
                <button
                  type="button"
                  onClick={() => void dispatch(selectDataModelProposalThunk(proposal.id))}
                  className={proposal.id === selectedId ? styles.itemActive : styles.item}
                >
                  <span className={styles.itemTop}>
                    <span className={styles.version}>v{proposal.version}</span>
                    <span className={STATUS_BADGE[proposal.status]}>{STATUS_LABEL[proposal.status]}</span>
                  </span>
                  <span className={styles.itemMeta}>
                    {proposal.proposal ? `${proposal.proposal.tables.length} tables` : '—'}
                    {errors > 0 ? ` · ${errors} rule errors` : ''}
                    {proposal.feedback ? ' · revision' : ''}
                    {' · '}
                    {formatDate(proposal.created_at)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

const styles = {
  list: `divide-y divide-gray-200`,
  item: `
    w-full text-left px-4 py-2 flex flex-col gap-0.5 hover:bg-gray-50 transition-colors cursor-pointer
  `,
  itemActive: `
    w-full text-left px-4 py-2 flex flex-col gap-0.5 bg-blue-50/60 cursor-pointer
    border-l-2 border-blue-500
  `,
  itemTop: `flex items-center gap-2`,
  version: `text-xs font-semibold text-gray-900 tabular-nums`,
  itemMeta: `text-[11px] text-gray-500`,
  empty: `px-4 py-4 text-xs text-gray-500`,
  error: `mx-4 mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
};
