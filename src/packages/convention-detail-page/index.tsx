'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useBreadcrumbs } from '@/hooks';
import { detailPageStyles } from '@/components/detail-page-styles';
import { CONVENTIONS_PATH } from '@/config/routes';
import { getConventionOptionsThunk, loadCurrentConventionDetailThunk } from '@/store/thunks/conventions';
import { Overview } from './overview';
import { Roles } from './roles';
import { Examples } from './examples';
import { Sources } from './sources';

export const ConventionDetailPage = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);
  const conventionId = current.convention.id;

  useBreadcrumbs([
    { label: 'Conventions', href: CONVENTIONS_PATH },
    { label: current.convention.key || 'Convention' },
  ]);

  useEffect(() => {
    if (!conventionId) return;
    void dispatch(getConventionOptionsThunk());
    void dispatch(loadCurrentConventionDetailThunk());
  }, [dispatch, conventionId]);

  if (!conventionId) {
    return (
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>Convention not found</p>
          <a href={CONVENTIONS_PATH} className={detailPageStyles.emptyLink}>
            Back to Conventions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={detailPageStyles.page}>
      <Overview />
      <Roles />
      <Examples />
      <Sources />
    </div>
  );
};
