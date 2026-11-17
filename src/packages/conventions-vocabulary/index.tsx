'use client';

import { useEffect } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { CONVENTIONS_PATH } from '@/config/routes';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { getConventionsThunk } from '@/store/thunks/conventions';
import { ColumnTypes } from './column-types';
import { LifecycleOptions } from './lifecycle-options';
import { StandardColumns } from './standard-columns';
import { TableArchetypes } from './table-archetypes';

/** Read-only view of the data-model vocabulary the AI and generators use. */
export const ConventionsVocabulary = () => {
  const dispatch = useAppDispatch();
  const topicCount = useAppSelector((state) => state.conventionsCatalog.topics.length);

  useBreadcrumbs([{ label: 'Conventions', href: CONVENTIONS_PATH }, { label: 'Data-model vocabulary' }]);

  useEffect(() => {
    if (topicCount === 0) void dispatch(getConventionsThunk());
  }, [dispatch, topicCount]);

  return (
    <div className={detailPageStyles.page}>
      <StandardColumns />
      <ColumnTypes />
      <LifecycleOptions />
      <TableArchetypes />
    </div>
  );
};
