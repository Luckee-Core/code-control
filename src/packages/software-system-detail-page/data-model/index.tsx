'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  getDataModelProposalsThunk,
  refreshRunningDataModelProposalsThunk,
} from '@/store/thunks/data-model-proposals';
import { ContextForm } from './context-form';
import { Proposal } from './proposal';
import { Versions } from './versions';

const POLL_MS = 3000;

/**
 * Data model tab: describe the product, let AI propose core tables from the seeded
 * conventions, review, revise and approve versions.
 */
export const DataModel = () => {
  const dispatch = useAppDispatch();
  const softwareSystemId = useAppSelector((state) => state.currentSoftwareSystem.id);
  const hasRunning = useAppSelector((state) =>
    Object.values(state.dataModelProposals).some((proposal) => proposal.status === 'running'),
  );

  useEffect(() => {
    if (softwareSystemId) void dispatch(getDataModelProposalsThunk());
  }, [dispatch, softwareSystemId]);

  useEffect(() => {
    if (!hasRunning) return;
    const timer = setInterval(() => {
      void dispatch(refreshRunningDataModelProposalsThunk());
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [dispatch, hasRunning]);

  if (!softwareSystemId) return null;

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <ContextForm />
        <Versions />
      </div>
      <div className={styles.main}>
        <Proposal />
      </div>
    </div>
  );
};

const styles = {
  layout: `
    grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-5 items-start
  `,
  sidebar: `
    flex flex-col gap-5 min-w-0
  `,
  main: `
    min-w-0
  `,
};
