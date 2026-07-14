'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CustomerBuilderActions } from '@/store/builders';
import { CurrentCustomerActions } from '@/store/current';

export const CustomersHeader = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);
  const count = Object.keys(customers).length;
  const countLabel = `${count} customer${count !== 1 ? 's' : ''}`;

  const handleAddCustomer = () => {
    dispatch(CurrentCustomerActions.reset());
    dispatch(CustomerBuilderActions.openCustomerModal());
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <div className={styles.sectionSummary}>
          <span className={styles.sectionTitle}>{countLabel}</span>
          <span className={styles.sectionDivider}>•</span>
          <span className={styles.sectionMeta}>Customer accounts</span>
        </div>
        <button type="button" onClick={handleAddCustomer} className={styles.createButton}>
          Add Customer
        </button>
      </div>
    </div>
  );
};

const styles = {
  section: `
    mb-3
  `,
  sectionHeaderRow: `
    flex justify-between items-center mb-3
  `,
  sectionSummary: `
    flex items-center gap-1.5
  `,
  sectionTitle: `
    text-base font-semibold text-gray-900
  `,
  sectionDivider: `
    text-gray-300 text-sm
  `,
  sectionMeta: `
    text-xs text-gray-500
  `,
  createButton: `
    px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 border-none cursor-pointer
  `,
};
