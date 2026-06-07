'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCurrentProjectThunk } from '@/store/thunks/projects';
import type { Project } from '@/model/project';
import { formatDate } from '@/utils/date-time';

const truncate = (text: string | null, max: number): string => {
  if (!text) return '—';
  if (text.length <= max) return text;
  return text.slice(0, max) + '…';
};

export const ProjectsList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const customers = useAppSelector((state) => state.customers);

  const customerNameById = useMemo(() => {
    const map = new Map<string, string>();
    Object.values(customers).forEach((customer) => {
      map.set(customer.id, customer.name);
    });
    return map;
  }, [customers]);

  const getCustomerName = (customerId: string | undefined): string => {
    if (!customerId) return '—';
    return customerNameById.get(customerId) ?? '—';
  };

  const handleOpen = (project: Project) => {
    dispatch(setCurrentProjectThunk(project));
    router.push(`/projects/${project.id}`);
  };

  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No projects yet</p>
        <p className={styles.emptyDescription}>
          Create a project to start defining schema and running the build pathway.
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
            <th className={styles.tableHeader}>Customer</th>
            <th className={styles.tableHeader}>Description</th>
            <th className={styles.tableHeader}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className={styles.row}>
              <td className={styles.cell}>
                <button
                  type="button"
                  onClick={() => handleOpen(project)}
                  className={styles.projectNameButton}
                >
                  {project.name}
                </button>
              </td>
              <td className={styles.cell}>
                <span className={styles.customerName}>{getCustomerName(project.customer_id)}</span>
              </td>
              <td className={styles.cellDescription}>
                {truncate(project.description, 60)}
              </td>
              <td className={styles.cell}>{formatDate(project.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: `border border-gray-200 rounded-lg overflow-hidden bg-white`,
  table: `w-full text-left border-collapse`,
  tableHeader: `px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-200`,
  row: `border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors`,
  cell: `px-4 py-3 text-sm text-gray-900`,
  cellDescription: `px-4 py-3 text-sm text-gray-600 max-w-xs`,
  projectNameButton: `font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0`,
  customerName: `text-gray-700 text-sm`,
  emptyState: `border border-gray-200 rounded-lg bg-white p-8 text-center`,
  emptyTitle: `text-sm font-medium text-gray-900 mb-1`,
  emptyDescription: `text-sm text-gray-500`,
};
