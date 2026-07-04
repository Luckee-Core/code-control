'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentProjectActions } from '@/store/current';

export const ProjectsHeader = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const countLabel = `${projects.length} project${projects.length !== 1 ? 's' : ''}`;

  const handleCreateProject = () => {
    dispatch(CurrentProjectActions.reset());
    dispatch(WorkspaceBuilderActions.openProjectModal(null));
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <div className={styles.sectionSummary}>
          <span className={styles.sectionTitle}>{countLabel}</span>
          <span className={styles.sectionDivider}>•</span>
          <span className={styles.sectionMeta}>
            Customer build projects
          </span>
        </div>
        <button type="button" onClick={handleCreateProject} className={styles.createButton}>
          Create Project
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
