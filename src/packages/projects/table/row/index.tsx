'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCurrentProjectThunk } from '@/store/thunks/projects';
import { setCurrentCustomerThunk } from '@/store/thunks/customers';
import { CUSTOMER_DETAIL_PAGE_PATH, PROJECT_DETAIL_PAGE_PATH } from '@/config/routes';
import type { Project } from '@/model/project';
import { formatDate } from '@/utils/date-time';
import { truncateText } from '../../truncate-text';

type RowProps = {
  project: Project;
};

export const Row = ({ project }: RowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);
  const customer = useMemo(
    () => (project.customer_id ? customers[project.customer_id] : undefined),
    [customers, project.customer_id]
  );
  const customerName = customer?.name ?? '—';

  const handleOpen = async () => {
    const status = await dispatch(setCurrentProjectThunk(project));
    if (status === 200) {
      router.push(PROJECT_DETAIL_PAGE_PATH);
    }
  };

  const handleOpenCustomer = async () => {
    if (!customer) return;
    const result = await dispatch(setCurrentCustomerThunk(customer));
    if (result === 200) {
      router.push(CUSTOMER_DETAIL_PAGE_PATH);
    }
  };

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <button type="button" onClick={() => void handleOpen()} className={styles.projectNameButton}>
          {project.name}
        </button>
      </td>
      <td className={styles.cell}>
        {customer ? (
          <button
            type="button"
            onClick={() => void handleOpenCustomer()}
            className={styles.customerNameButton}
          >
            {customerName}
          </button>
        ) : (
          <span className={styles.customerName}>{customerName}</span>
        )}
      </td>
      <td className={styles.cellDescription}>{truncateText(project.description, 60)}</td>
      <td className={styles.cell}>{formatDate(project.updated_at)}</td>
    </tr>
  );
};

const styles = {
  row: `
    hover:bg-gray-50 transition-colors
  `,
  cell: `
    px-4 py-3 text-sm text-gray-900 border-b border-gray-100
  `,
  cellDescription: `
    px-4 py-3 text-sm text-gray-600 max-w-xs border-b border-gray-100
  `,
  projectNameButton: `
    font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0
  `,
  customerNameButton: `
    font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0
  `,
  customerName: `
    text-gray-700 text-sm
  `,
};
