'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useBreadcrumbs } from '@/hooks';
import { detailPageStyles } from '@/components/detail-page-styles';
import { SOFTWARE_SYSTEMS_PATH } from '@/config/routes';
import {
  getReposBySoftwareSystemIdThunk,
  loadGithubOrgsThunk,
} from '@/store/thunks/software-system-repos';
import { Overview } from './overview';
import { Repositories } from './repositories';

export const ProjectDetailPage = () => {
  const dispatch = useAppDispatch();
  const currentSoftwareSystem = useAppSelector((state) => state.currentSoftwareSystem);

  useBreadcrumbs([
    { label: 'Projects', href: SOFTWARE_SYSTEMS_PATH },
    { label: currentSoftwareSystem.name || 'SoftwareSystem' },
  ]);

  useEffect(() => {
    if (!currentSoftwareSystem.id) {
      return;
    }
    void dispatch(getReposBySoftwareSystemIdThunk());
    void dispatch(loadGithubOrgsThunk());
  }, [dispatch, currentSoftwareSystem.id]);

  if (!currentSoftwareSystem.id) {
    return (
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>SoftwareSystem not found</p>
          <a href={SOFTWARE_SYSTEMS_PATH} className={detailPageStyles.emptyLink}>
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
