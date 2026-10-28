'use client';

import { useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formatStage } from '../format-stage';
import { stageColor } from '../stage-color';

export const Header = () => {
  const customer = useAppSelector((state) => state.currentCustomer);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{customer.name}</h1>
          {customer.description ? (
            <p className={detailPageStyles.panelSubtitle}>{customer.description}</p>
          ) : null}
        </div>
        <span className={`${styles.stageBadge} ${stageColor(customer.stage)}`}>
          {formatStage(customer.stage)}
        </span>
      </div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <span className={detailPageStyles.fieldLabel}>Stage</span>
          <span className={detailPageStyles.fieldValue}>{formatStage(customer.stage)}</span>
        </div>
      </div>
    </section>
  );
};

const styles = {
  titleBlock: `flex flex-col gap-1 min-w-0`,
  title: `text-lg font-semibold text-gray-900 tracking-tight`,
  stageBadge: `
    text-xs font-medium px-2.5 py-1 rounded-full shrink-0
  `,
  fields: `
    px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-300
  `,
  field: `flex flex-col gap-1`,
};
