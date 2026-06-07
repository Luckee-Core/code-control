'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCurrentCustomerThunk } from '@/store/thunks/customers';
import { CUSTOMER_DETAIL_PAGE_PATH } from '@/config/routes';
import type { Customer } from '@/model/customer';

export const CustomersList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);
  const projects = useAppSelector((state) => state.projects);

  const projectCountByCustomerId = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => {
      if (!project.customer_id) return;
      counts.set(project.customer_id, (counts.get(project.customer_id) ?? 0) + 1);
    });
    return counts;
  }, [projects]);

  const customerList = useMemo(
    () => Object.values(customers).sort((a, b) => a.name.localeCompare(b.name)),
    [customers]
  );

  const handleOpenCustomer = async (customer: Customer) => {
    const result = await dispatch(setCurrentCustomerThunk(customer));
    if (result === 200) {
      router.push(CUSTOMER_DETAIL_PAGE_PATH);
    }
  };

  if (customerList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No customers loaded</p>
        <p className={styles.emptyDescription}>
          Customers are managed in THT. They appear here once loaded from the API.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Stage</th>
            <th className={styles.tableHeader}>Projects</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((customer: Customer) => (
            <tr
              key={customer.id}
              className={styles.row}
              onClick={() => handleOpenCustomer(customer)}
            >
              <td className={styles.cell}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCustomer(customer);
                  }}
                  className={styles.customerNameButton}
                >
                  {customer.name}
                </button>
              </td>
              <td className={styles.cell}>
                <span className={styles.stageBadge}>{formatStage(customer.stage)}</span>
              </td>
              <td className={styles.cell}>
                {projectCountByCustomerId.get(customer.id) ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatStage = (stage: Customer['stage']): string => {
  switch (stage) {
    case 'discovery_call':
      return 'Discovery';
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    default:
      return stage;
  }
};

const styles = {
  tableContainer: `border border-gray-200 rounded-lg overflow-hidden bg-white`,
  table: `w-full text-left border-collapse`,
  tableHeader: `px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-200`,
  row: `border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer`,
  cell: `px-4 py-3 text-sm text-gray-900`,
  customerNameButton: `font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0`,
  stageBadge: `text-xs text-gray-600`,
  emptyState: `border border-gray-200 rounded-lg bg-white p-8 text-center`,
  emptyTitle: `text-sm font-medium text-gray-900 mb-1`,
  emptyDescription: `text-sm text-gray-500`,
};
