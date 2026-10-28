'use client';

import { useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formatDate } from '@/utils/date-time';

export const Overview = () => {
  const customer = useAppSelector((state) => state.currentCustomer);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>Metadata</h2>
      </div>
      <div className={detailPageStyles.panelBody}>
        <div className={styles.metadataGrid}>
          <div className={styles.metadataItem}>
            <span className={detailPageStyles.fieldLabel}>Created</span>
            <span className={detailPageStyles.fieldValue}>{formatDate(customer.created_at)}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={detailPageStyles.fieldLabel}>Last updated</span>
            <span className={detailPageStyles.fieldValue}>{formatDate(customer.updated_at)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  metadataGrid: `
    grid grid-cols-1 sm:grid-cols-2 gap-4
  `,
  metadataItem: `
    flex flex-col gap-1
  `,
};
