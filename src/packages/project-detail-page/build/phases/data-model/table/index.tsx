'use client';

import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { createBatchDataModelQueueThunk, retryDataModelQueueItemThunk, getAllDataModelGenerationQueueThunk } from '@/store/thunks';
import { DataModelQueueRow } from './row';
import { Search, FolderOpen, RefreshCw } from 'lucide-react';

type DataModelQueueTableProps = {
  repoId: string;
  repoName: string;
};

export const DataModelQueueTable = ({ repoId }: DataModelQueueTableProps) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const currentProject = useAppSelector((state) => state.currentProject);
  const entities = useAppSelector((state) => state.dataEntities);
  const queue = useAppSelector((state) => state.dataModelGenerationQueue);
  const selectedEntityIds = useAppSelector((state) => state.dataModelBuilder.selectedEntityIds);
  const isGenerating = useAppSelector((state) => state.dataModelBuilder.isGenerating);

  const assignedEntities = entities.filter((e) =>
    (e.assigned_repo_ids ?? []).includes(repoId)
  );

  // Filter queue items by current repo
  const repoQueueItems = useMemo(() => {
    return queue.filter(q => q.repo_id === repoId);
  }, [queue, repoId]);

  const filteredEntities = useMemo(() => {
    if (!search.trim()) return assignedEntities;
    const q = search.toLowerCase();
    return assignedEntities.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.description ?? '').toLowerCase().includes(q) ||
        (e.table_name ?? '').toLowerCase().includes(q)
    );
  }, [assignedEntities, search]);

  // Get selected items with their queue status (filtered by repo)
  const selectedItems = useMemo(() => {
    return selectedEntityIds.map(entityId => {
      const queueItem = repoQueueItems.find(q => q.entity_id === entityId);
      return { entityId, queueItem };
    });
  }, [selectedEntityIds, repoQueueItems]);

  const selectedReadyItems = selectedItems.filter(item => !item.queueItem);
  const selectedFailedItems = selectedItems.filter(item => item.queueItem?.status === 'failed');

  const handleGenerate = async () => {
    if (!currentProject || selectedReadyItems.length === 0) return;
    await dispatch(
      createBatchDataModelQueueThunk({
        project_id: currentProject.id,
        repo_id: repoId,
        entity_ids: selectedReadyItems.map(item => item.entityId),
      })
    );
  };

  const handleRetry = async () => {
    if (selectedFailedItems.length === 0) return;
    
    for (const item of selectedFailedItems) {
      if (item.queueItem) {
        await dispatch(retryDataModelQueueItemThunk(item.queueItem.id));
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getAllDataModelGenerationQueueThunk());
    setIsRefreshing(false);
  };

  if (assignedEntities.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FolderOpen className={styles.emptyStateIcon} />
        <p className={styles.emptyStateText}>
          No entities assigned to this repo yet.
        </p>
        <p className={styles.emptyStateSubtext}>
          Assign entities above to generate TypeScript models.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <div className={styles.searchWrapper}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entities by name, description, or table…"
            className={styles.searchInput}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={styles.refreshButton}
            title="Refresh queue status"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          {selectedFailedItems.length > 0 && (
            <button
              onClick={handleRetry}
              className={styles.retryButton}
            >
              Retry Failed ({selectedFailedItems.length})
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={selectedReadyItems.length === 0 || isGenerating}
            className={styles.generateButton}
          >
            {isGenerating
              ? 'Generating…'
              : `Generate Selected (${selectedReadyItems.length})`}
          </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">
                Select
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Entity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Output Path
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                PR
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEntities.map((entity) => {
              const queueItem = repoQueueItems.find(q => q.entity_id === entity.id);
              return (
                <DataModelQueueRow 
                  key={entity.id} 
                  entity={entity}
                  queueItem={queueItem}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: `
    flex flex-col gap-4
  `,
  searchRow: `
    flex items-center gap-3
  `,
  searchWrapper: `
    relative flex-1
  `,
  searchInput: `
    w-full pl-9 pr-4 py-2 text-sm border border-input bg-background rounded-md
    focus:outline-none focus:ring-2 focus:ring-ring focus:border-input
    placeholder:text-muted-foreground
  `,
  buttonGroup: `
    flex items-center gap-2
  `,
  refreshButton: `
    p-2 rounded-md
    border border-input bg-background hover:bg-accent
    text-muted-foreground hover:text-foreground
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
  generateButton: `
    px-4 py-2 text-sm font-medium rounded-md
    bg-primary text-primary-foreground hover:bg-primary/90
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
  retryButton: `
    px-4 py-2 text-sm font-medium rounded-md
    bg-amber-600 text-white hover:bg-amber-700
    transition-colors
  `,
  tableWrapper: `
    rounded-md border border-border overflow-hidden bg-card
  `,
  table: `
    w-full border-collapse
  `,
  emptyState: `
    flex flex-col items-center justify-center py-12 px-4 text-center
    rounded-md border border-dashed border-border bg-muted/20
  `,
  emptyStateIcon: `
    h-12 w-12 text-muted-foreground mb-3
  `,
  emptyStateText: `
    text-sm font-medium text-foreground mb-1
  `,
  emptyStateSubtext: `
    text-xs text-muted-foreground
  `,
};
