'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { LedgerTable } from '@/packages/conventions-history';
import { useAppDispatch, useAppSelector } from '@/store';
import { getConventionHistoryThunk } from '@/store/thunks/convention-changes';

/** This convention's change history (from the ledger). */
export const History = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);
  const changes = useAppSelector((state) => state.conventionChanges);

  useEffect(() => {
    if (current.id) void dispatch(getConventionHistoryThunk());
  }, [dispatch, current.id, current.updated_at]);

  const rows = useMemo(
    () => Object.values(changes).filter((change) => change.convention_id === current.id).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [changes, current.id],
  );

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>History</h2>
          <p className={detailPageStyles.panelSubtitle}>Every change to this convention, newest first.</p>
        </div>
      </div>
      <LedgerTable changes={rows} showKey={false} emptyText="No recorded changes yet." />
    </section>
  );
};
