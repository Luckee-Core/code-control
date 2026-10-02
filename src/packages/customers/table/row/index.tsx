'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCurrentCustomerThunk } from '@/store/thunks/customers';
import { CUSTOMER_DETAIL_PAGE_PATH } from '@/config/routes';
import type { Customer } from '@/model/customer';
import { formatStage } from '../../format-stage';

type RowProps = {
  customer: Customer;
};

export const Row = ({ customer }: RowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const projectCount = useMemo(
    () => Object.values(projects).filter((project) => project.customer_id === customer.id).length,
    [projects, customer.id]
  );

  const handleOpenCustomer = async () => {
    const result = await dispatch(setCurrentCustomerThunk(customer));
    if (result === 200) {
      router.push(CUSTOMER_DETAIL_PAGE_PATH);
    }
  };

  return (
    <tr className={styles.row} onClick={() => void handleOpenCustomer()}>
      <td className={styles.cell}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            void handleOpenCustomer();
          }}
          className={styles.customerNameButton}
        >
          {customer.name}
        </button>
      </td>
      <td className={styles.cell}>
        <span className={styles.stageBadge}>{formatStage(customer.stage)}</span>
      </td>
      <td className={styles.cell}>{projectCount}</td>
    </tr>
  );
};

const styles = {
  row: `
    border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer
  `,
  cell: `
    px-4 py-3 text-sm text-gray-900
  `,
  customerNameButton: `
    font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0
  `,
  stageBadge: `
    text-xs text-gray-600
  `,
};
