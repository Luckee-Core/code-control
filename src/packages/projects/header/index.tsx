'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { STUDIO_SETUP_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentProjectActions } from '@/store/current';

export const Header = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const count = useMemo(() => Object.keys(projects).length, [projects]);
  const countLabel = `${count} project${count !== 1 ? 's' : ''}`;

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
          <span className={styles.sectionMeta}>Customer build projects</span>
        </div>
        <div className={styles.actions}>
          <Link href={STUDIO_SETUP_PATH} className={styles.setupLink}>
            Studio setup
          </Link>
          <button type="button" onClick={handleCreateProject} className={styles.createButton}>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: `
    mb-0
  `,
  sectionHeaderRow: `
    flex justify-between items-center
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
  actions: `
    flex items-center gap-2
  `,
  setupLink: `
    px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50
  `,
  createButton: `
    px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 border-none cursor-pointer
  `,
};
