'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';
import { AiCalls } from './ai-calls';
import { Deliver } from './deliver';
import { Header } from './header';
import { Notes } from './notes';
import { ReviseForm } from './revise-form';
import { RunningState } from './running-state';
import { TableCard } from './table-card';
import { Warnings } from './warnings';

export const Proposal = () => {
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const proposal = useAppSelector((state) => (selectedId ? state.dataModelProposals[selectedId] : undefined));

  if (!proposal) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No data model yet</p>
          <p className={styles.emptyText}>
            Paste the product context on the left and press <strong>Generate data model</strong>. The AI reads the
            active data-model conventions and proposes the core tables for the storage repo&apos;s Postgres database.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className={styles.stack}>
      <Header />
      {proposal.status === 'approved' && proposal.proposal ? <Deliver proposalId={proposal.id} kind="model" /> : null}
      {proposal.proposal && proposal.status !== 'running' ? <ReviseForm /> : null}
      {proposal.status === 'running' ? <RunningState /> : null}
      {proposal.status === 'failed' ? (
        <div className={styles.failed}>
          <p className={styles.failedTitle}>Generation failed</p>
          <p>{proposal.error ?? 'Unknown error'}</p>
        </div>
      ) : null}
      {proposal.proposal ? (
        <>
          <Warnings />
          <div className={styles.tables}>
            {proposal.proposal.tables.map((table) => (
              <TableCard
                key={table.name}
                table={table}
                warnings={proposal.warnings.filter((warning) => warning.table === table.name)}
              />
            ))}
          </div>
          <Notes />
        </>
      ) : null}
      <AiCalls />
    </div>
  );
};

const styles = {
  stack: `flex flex-col gap-5`,
  tables: `flex flex-col gap-4`,
  empty: `px-6 py-10 flex flex-col gap-2 max-w-xl`,
  emptyTitle: `text-sm font-semibold text-gray-900`,
  emptyText: `text-xs text-gray-600 leading-relaxed`,
  failed: `text-xs text-red-800 bg-red-50 border border-red-200 rounded px-4 py-3 flex flex-col gap-1`,
  failedTitle: `font-semibold`,
};
