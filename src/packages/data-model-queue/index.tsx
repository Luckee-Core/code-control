'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { DataModelBuilderActions } from '@/store/builders/dataModelBuilder';
import { DataModelQueueHeader } from './header';
import { DataModelQueueTable } from './table';
import { useFilteredItems } from './useFilteredItems';

export const DataModelQueuePage = () => {
  const dispatch = useAppDispatch();
  const filterStatus = useAppSelector((state) => state.dataModelBuilder.filterStatus);
  const sortColumn = useAppSelector((state) => state.dataModelBuilder.sortColumn);
  const sortDirection = useAppSelector((state) => state.dataModelBuilder.sortDirection);
  const filteredItems = useFilteredItems({ filterStatus, sortColumn, sortDirection });

  useEffect(() => {
    dispatch(DataModelBuilderActions.setFilteredItems(filteredItems));
  }, [dispatch, filteredItems]);

  return (
    <div className={styles.container}>
      <DataModelQueueHeader />

      {filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No data model queue items found</p>
          <p className={styles.emptyHint}>Add items from a project&apos;s data model phase.</p>
        </div>
      ) : (
        <DataModelQueueTable />
      )}
    </div>
  );
};

const styles = {
  container: `
    w-full space-y-3 p-2
  `,
  emptyState: `
    bg-white border border-gray-300 rounded p-8 text-center
  `,
  emptyText: `
    text-gray-500 text-xs
  `,
  emptyHint: `
    text-gray-400 text-xs mt-2
  `,
};
