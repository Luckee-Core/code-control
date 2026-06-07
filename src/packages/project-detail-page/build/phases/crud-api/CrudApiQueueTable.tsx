/**
 * CRUD API Queue Table
 *
 * Shows one row per queue item (one per operation) for this repo.
 * Queue items are the operations that were selected and generated.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { CrudApiBuilderActions } from '@/store/builders/crudApiBuilder';
import {
  getAllCrudApiQueueThunk,
  retryCrudApiQueueItemThunk,
  deleteCrudApiQueueItemThunk,
} from '@/store/thunks/crud-api-generation-queue';
import { CrudApiQueueItemRow } from './CrudApiQueueItemRow';
import { RefreshCw } from 'lucide-react';

type CrudApiQueueTableProps = {
  repoId: string;
  repoName: string;
};

export const CrudApiQueueTable = ({ repoId, repoName }: CrudApiQueueTableProps) => {
  const dispatch = useAppDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queue = useAppSelector((state) => state.crudApiGenerationQueue);
  const dataEntities = useAppSelector((state) => state.dataEntities);
  const selectedQueueItemIds = useAppSelector((state) => state.crudApiBuilder.selectedCrudApiQueueItemIds);

  useEffect(() => {
    void dispatch(getAllCrudApiQueueThunk());
  }, [dispatch]);

  const repoQueueItems = useMemo(() => {
    return queue
      .filter((q) => q.repo_id === repoId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [queue, repoId]);

  const entityMap = useMemo(() => {
    const map = new Map<string, (typeof dataEntities)[number]>();
    dataEntities.forEach((e) => map.set(e.id, e));
    return map;
  }, [dataEntities]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getAllCrudApiQueueThunk());
    setIsRefreshing(false);
  };

  const selectedItems = repoQueueItems.filter((q) => selectedQueueItemIds.includes(q.id));
  const selectedFailedItems = selectedItems.filter((q) => q.status === 'failed');

  const allSelected =
    repoQueueItems.length > 0 &&
    repoQueueItems.every((q) => selectedQueueItemIds.includes(q.id));
  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(CrudApiBuilderActions.clearSelectedCrudApiQueueItemIds());
    } else {
      dispatch(CrudApiBuilderActions.setSelectedCrudApiQueueItemIds(repoQueueItems.map((q) => q.id)));
    }
  };

  const handleRetryFailed = async () => {
    for (const item of selectedFailedItems) {
      await dispatch(retryCrudApiQueueItemThunk(item.id));
    }
    dispatch(CrudApiBuilderActions.clearSelectedCrudApiQueueItemIds());
    await dispatch(getAllCrudApiQueueThunk());
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Delete ${selectedItems.length} selected queue item(s)?`)) return;
    for (const item of selectedItems) {
      await dispatch(deleteCrudApiQueueItemThunk(item.id));
    }
    dispatch(CrudApiBuilderActions.clearSelectedCrudApiQueueItemIds());
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>CRUD operations queue for {repoName}</h3>
        <div className={styles.buttonGroup}>
          {selectedFailedItems.length > 0 && (
            <button
              type="button"
              onClick={handleRetryFailed}
              className={styles.retryButton}
            >
              Retry Failed ({selectedFailedItems.length})
            </button>
          )}
          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              className={styles.deleteButton}
            >
              Delete selected ({selectedItems.length})
            </button>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={styles.refreshButton}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {repoQueueItems.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            No CRUD operations in queue. Select entities above and click
            &quot;Generate CRUD Operations&quot; to add operations.
          </p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCheckbox}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                    title={allSelected ? 'Deselect all' : 'Select all'}
                  />
                </th>
                <th className={styles.th}>Entity</th>
                <th className={styles.th}>Operation</th>
                <th className={styles.th}>File path</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Error</th>
                <th className={styles.th}>PR</th>
                <th className={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {repoQueueItems.map((item) => (
                <CrudApiQueueItemRow
                  key={item.id}
                  item={item}
                  entity={item.entity_id != null ? entityMap.get(item.entity_id) ?? null : null}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `
    flex flex-col gap-4
  `,
  header: `
    flex items-center justify-between
  `,
  title: `
    text-sm font-semibold text-gray-900
  `,
  buttonGroup: `
    flex items-center gap-2
  `,
  retryButton: `
    px-4 py-2 text-sm font-medium rounded-lg
    bg-amber-600 text-white hover:bg-amber-700
    transition-colors
  `,
  deleteButton: `
    px-4 py-2 text-sm font-medium rounded-lg
    border border-red-300 bg-white text-red-700
    hover:bg-red-50 transition-colors
  `,
  refreshButton: `
    p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50
    text-gray-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
  thCheckbox: `
    px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12
    bg-gray-50 border-b border-gray-200
  `,
  checkbox: `
    h-4 w-4 rounded border-gray-300 text-blue-600
    focus:ring-blue-500 cursor-pointer
  `,
  tableWrapper: `
    rounded-lg border border-gray-300 overflow-hidden bg-white
  `,
  table: `
    w-full border-collapse
  `,
  th: `
    px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
    bg-gray-50 border-b border-gray-200
  `,
  emptyState: `
    bg-white border border-gray-300 rounded-lg p-8 text-center
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
};
