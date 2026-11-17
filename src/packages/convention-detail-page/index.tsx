'use client';

import { useEffect } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { CONVENTIONS_PATH } from '@/config/routes';
import { useBreadcrumbs } from '@/hooks';
import { FormModal } from '@/packages/conventions';
import { useAppDispatch, useAppSelector } from '@/store';
import { getConventionsThunk } from '@/store/thunks/conventions';
import { Examples } from './examples';
import { Overview } from './overview';
import { Sources } from './sources';

export const ConventionDetailPage = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);
  const topicCount = useAppSelector((state) => state.conventionsCatalog.topics.length);

  useBreadcrumbs([
    { label: 'Conventions', href: CONVENTIONS_PATH },
    { label: current.title || 'Convention' },
  ]);

  useEffect(() => {
    if (topicCount === 0) {
      void dispatch(getConventionsThunk());
    }
  }, [dispatch, topicCount]);

  if (!current.id) {
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
      <Examples />
      <Sources />
      <FormModal />
    </div>
  );
};
