'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch } from '@/store';
import { getConventionOptionsThunk } from '@/store/thunks/conventions';
import { getConventionSnapshotsThunk } from '@/store/thunks/ai-context';
import { detailPageStyles } from '@/components/detail-page-styles';
import { Controls } from './controls';
import { Result } from './result';
import { Snapshots } from './snapshots';
import { SnapshotModal } from './snapshot-modal';

export const AiContext = () => {
  const dispatch = useAppDispatch();

  useBreadcrumbs([{ label: 'AI context' }]);

  useEffect(() => {
    void dispatch(getConventionOptionsThunk());
    void dispatch(getConventionSnapshotsThunk());
  }, [dispatch]);

  return (
    <div className={detailPageStyles.page}>
      <Controls />
      <Result />
      <Snapshots />
      <SnapshotModal />
    </div>
  );
};
