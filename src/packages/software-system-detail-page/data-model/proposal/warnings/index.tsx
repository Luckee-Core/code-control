'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProposalWarning } from '@/model/data-model-proposal';
import { useAppSelector } from '@/store';

const EMPTY: ProposalWarning[] = [];

export const Warnings = () => {
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const warnings = useAppSelector((state) =>
    selectedId ? state.dataModelProposals[selectedId]?.warnings ?? EMPTY : EMPTY,
  );

  if (warnings.length === 0) {
    return <p className={styles.clean}>Passes every automated data-model convention check.</p>;
  }

  const errors = warnings.filter((warning) => warning.severity === 'error').length;

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Convention checks</h2>
          <p className={detailPageStyles.panelSubtitle}>
            {errors} errors (MUST/NEVER) · {warnings.length - errors} warnings (SHOULD/AVOID)
          </p>
        </div>
      </div>
      <ul className={styles.list}>
        {warnings.map((warning, index) => (
          <li key={`${warning.convention_key}-${warning.table}-${warning.column}-${index}`} className={styles.item}>
            <span className={warning.severity === 'error' ? styles.error : styles.warning}>{warning.severity}</span>
            <span className={styles.location}>
              {warning.table}
              {warning.column ? `.${warning.column}` : ''}
            </span>
            <span className={styles.message}>{warning.message}</span>
            <span className={styles.key}>{warning.convention_key}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const styles = {
  clean: `text-xs text-green-800 bg-green-50 border border-green-200 rounded px-4 py-2`,
  list: `divide-y divide-gray-200`,
  item: `px-4 py-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs`,
  error: `text-[10px] font-semibold uppercase text-red-700 w-14`,
  warning: `text-[10px] font-semibold uppercase text-amber-700 w-14`,
  location: `font-mono text-gray-900`,
  message: `text-gray-700 flex-1 min-w-[12rem]`,
  key: `font-mono text-[10px] text-gray-400`,
};
