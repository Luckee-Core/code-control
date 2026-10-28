'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useBreadcrumbs } from '@/hooks';
import { detailPageStyles } from '@/components/detail-page-styles';
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
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>Project not found</p>
          <a href={PROJECTS_PATH} className={detailPageStyles.emptyLink}>
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={detailPageStyles.page}>
      <Overview />
      <Repositories />
    </div>
  );
};
