'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentProjectActions } from '@/store/current';
import { setCurrentProjectThunk } from '@/store/thunks/projects';
import type { Project } from '@/model/project';
import { formatDate } from '@/utils/date-time';
import { ProjectRowActionsMenu } from './project-row-actions-menu';

const truncate = (text: string | null, max: number): string => {
  if (!text) return '—';
  if (text.length <= max) return text;
  return text.slice(0, max) + '…';
};

export const CustomerProjectsTab = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentCustomer = useAppSelector((state) => state.currentCustomer);
  const projects = useAppSelector((state) => state.projects);

  const customerProjects = useMemo(
    () =>
      projects
        .filter((p) => p.customer_id === currentCustomer.id)
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [projects, currentCustomer.id]
  );

  const handleOpen = (project: Project) => {
    dispatch(setCurrentProjectThunk(project));
    router.push(`/projects/${project.id}`);
  };

  const handleAddProject = () => {
    dispatch(CurrentProjectActions.reset());
    dispatch(
      CurrentProjectActions.updateProjectFields({ customer_id: currentCustomer.id })
    );
    dispatch(WorkspaceBuilderActions.openProjectModal(null));
  };

  if (customerProjects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No projects yet</p>
        <p className={styles.emptyDescription}>
          Create a project to start defining schema and running the build pathway.
        </p>
        <button type="button" onClick={handleAddProject} className={styles.addButton}>
          Add Project
        </button>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Projects</h3>
        <button type="button" onClick={handleAddProject} className={styles.addButton}>
          Add Project
        </button>
      </div>
      <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Description</th>
            <th className={styles.tableHeader}>Updated</th>
            <th className={styles.tableHeaderActions} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {customerProjects.map((project) => (
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
              <td className={styles.cellDescription}>
                {truncate(project.description, 60)}
              </td>
              <td className={styles.cell}>{formatDate(project.updated_at)}</td>
              <td className={styles.cellActions}>
                <ProjectRowActionsMenu project={project} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

const styles = {
  section: `flex flex-col gap-3`,
  sectionHeader: `flex items-center justify-between`,
  sectionTitle: `text-sm font-semibold text-gray-900 uppercase tracking-wide`,
  addButton: `
    px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 border-none cursor-pointer
  `,
  tableContainer: `border border-gray-200 rounded-lg overflow-hidden bg-white`,
  table: `w-full text-left border-collapse`,
  tableHeader: `px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-200`,
  tableHeaderActions: `w-12 px-2 py-2.5 bg-gray-50 border-b border-gray-200`,
  row: `border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors`,
  cell: `px-4 py-3 text-sm text-gray-900`,
  cellActions: `px-2 py-3 w-12`,
  cellDescription: `px-4 py-3 text-sm text-gray-600 max-w-xs`,
  projectNameButton: `font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0`,
  emptyState: `border border-gray-200 rounded-lg bg-white p-8 text-center`,
  emptyTitle: `text-sm font-medium text-gray-900 mb-1`,
  emptyDescription: `text-sm text-gray-500`,
};
