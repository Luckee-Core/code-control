'use client';

import { useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formatCustomerStatus, statusColor } from '@/packages/customers/format-customer-status';
import { ActionsMenu } from '../actions-menu';

export const Header = () => {
  const customer = useAppSelector((state) => state.currentCustomer);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{customer.name}</h1>
          {customer.company ? (
            <p className={detailPageStyles.panelSubtitle}>{customer.company}</p>
          ) : null}
        </div>
        <div className={styles.headerActions}>
          <span className={`${styles.stageBadge} ${statusColor(customer.status)}`}>
            {formatCustomerStatus(customer.status)}
          </span>
          <ActionsMenu />
        </div>
      </div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <span className={detailPageStyles.fieldLabel}>Status</span>
          <span className={detailPageStyles.fieldValue}>{formatCustomerStatus(customer.status)}</span>
        </div>
      </div>
    </section>
  );
};

const styles = {
  titleBlock: `flex flex-col gap-1 min-w-0 flex-1`,
  title: `text-lg font-semibold text-gray-900 m-0 truncate`,
  headerActions: `flex shrink-0 items-center gap-2`,
  stageBadge: `
    inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium
  `,
  fields: `mt-3 grid grid-cols-2 gap-3 px-4 pb-4`,
  field: `flex flex-col gap-0.5`,
};
