'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useBreadcrumbs } from '@/hooks';
import { PROJECTS_PATH } from '@/config/routes';
import {
  getReposByProjectIdThunk,
  loadGithubOrgsThunk,
} from '@/store/thunks/project-repos';
import { Overview } from './overview';
import { Repositories } from './repositories';

export const ProjectDetailPage = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);

  useBreadcrumbs([
    { label: 'Projects', href: PROJECTS_PATH },
    { label: currentProject.name || 'Project' },
  ]);

  useEffect(() => {
    if (!currentProject.id) {
      return;
    }
    void dispatch(getReposByProjectIdThunk());
    void dispatch(loadGithubOrgsThunk());
  }, [dispatch, currentProject.id]);

  if (!currentProject.id) {
    return (
      <div className={styles.missing}>
        <p className={styles.loading}>Project not found</p>
        <a href={PROJECTS_PATH} className={styles.backButton}>
          Back to Projects
        </a>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.wrapper}>
        <div className={styles.tabContent}>
          <div className={styles.inner}>
            <Overview />
            <Repositories />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: `
    w-full flex-1 min-h-0 flex flex-col
  `,
  wrapper: `
    flex flex-col flex-1 min-h-0 overflow-hidden bg-card
  `,
  tabContent: `
    flex-1 overflow-auto p-6
  `,
  inner: `
    flex flex-col gap-8 w-full
  `,
  missing: `
    p-6
  `,
  loading: `
    text-gray-600 mb-4
  `,
  backButton: `
    inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300
  `,
};
