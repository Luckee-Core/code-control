'use client';

import { useAppSelector } from '@/store';
import { formatDate } from '@/utils/date-time';

export const Overview = () => {
  const customer = useAppSelector((state) => state.currentCustomer);

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Metadata</h3>
      <div className={styles.metadataGrid}>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>Created</span>
          <span className={styles.metadataValue}>{formatDate(customer.created_at)}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>Last updated</span>
          <span className={styles.metadataValue}>{formatDate(customer.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: `
    border border-gray-200 rounded-lg bg-white p-6
  `,
  sectionTitle: `
    text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4
  `,
  metadataGrid: `
    grid grid-cols-1 sm:grid-cols-2 gap-4
  `,
  metadataItem: `
    flex flex-col gap-1
  `,
  metadataLabel: `
    text-xs text-gray-500 uppercase tracking-wide
  `,
  metadataValue: `
    text-sm text-gray-900
  `,
};
