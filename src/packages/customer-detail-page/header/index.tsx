'use client';

import { useAppSelector } from '@/store';
import { formatStage } from '../format-stage';
import { stageColor } from '../stage-color';

export const Header = () => {
  const customer = useAppSelector((state) => state.currentCustomer);

  return (
    <div className={styles.headerCard}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{customer.name}</h1>
        <span className={`${styles.stageBadge} ${stageColor(customer.stage)}`}>
          {formatStage(customer.stage)}
        </span>
      </div>
      {customer.description && <p className={styles.description}>{customer.description}</p>}
    </div>
  );
};

const styles = {
  headerCard: `
    border border-gray-200 rounded-lg bg-white p-6
  `,
  titleRow: `
    flex items-center gap-3 flex-wrap
  `,
  title: `
    text-2xl font-semibold text-gray-900
  `,
  stageBadge: `
    text-xs font-medium px-2.5 py-1 rounded-full
  `,
  description: `
    mt-3 text-sm text-gray-600
  `,
};
