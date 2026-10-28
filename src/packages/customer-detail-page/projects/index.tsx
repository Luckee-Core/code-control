'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector, useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentProjectActions } from '@/store/current';
import { Row } from './row';

export const Projects = () => {
  const dispatch = useAppDispatch();
  const currentCustomer = useAppSelector((state) => state.currentCustomer);
  const projects = useAppSelector((state) => state.projects);

  const customerProjects = useMemo(
    () =>
      Object.values(projects)
        .filter((project) => project.customer_id === currentCustomer.id)
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [projects, currentCustomer.id]
  );

  const handleAddProject = () => {
    dispatch(CurrentProjectActions.reset());
    dispatch(CurrentProjectActions.updateProjectFields({ customer_id: currentCustomer.id }));
    dispatch(WorkspaceBuilderActions.openProjectModal(null));
  };

  if (customerProjects.length === 0) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelBody}>
          <div className={styles.emptyState}>
            <p className={detailPageStyles.fieldValue}>No projects yet</p>
            <p className={detailPageStyles.panelSubtitle}>
              Create a project to start defining schema and running the build pathway.
            </p>
            <button type="button" onClick={handleAddProject} className={styles.tabActionButton}>
              Add project
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>Projects</h2>
        <button type="button" onClick={handleAddProject} className={styles.tabActionButton}>
          Add project
        </button>
      </div>
      <div className={styles.tableScrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Updated</th>
              <th className={styles.thActions} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {customerProjects.map((project) => (
              <Row key={project.id} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const styles = {
  emptyState: `
    flex flex-col items-start gap-2 py-4
  `,
  tabActionButton: `
    px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500
    cursor-pointer border-none
  `,
  tableScrollContainer: `overflow-x-auto overflow-visible`,
  table: `w-full border-collapse text-xs`,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
  thActions: `
    w-12 px-2 py-2 bg-gray-100 border-b border-gray-300
  `,
};
