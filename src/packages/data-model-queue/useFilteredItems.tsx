import { useMemo, useCallback } from 'react';
import { useAppSelector } from '@/store';
import type { DataModelGenerationQueue } from '@/model';
import { truncateId } from '@/utils/string/truncate-id';

type DataModelQueueStatus = 'queued' | 'processing' | 'completed' | 'failed';

type SortColumn =
  | 'status'
  | 'project'
  | 'repo'
  | 'entity'
  | 'file_path'
  | 'scheduled_at'
  | 'started_at'
  | 'completed_at'
  | 'error';

type UseFilteredItemsProps = {
  filterStatus: 'all' | DataModelQueueStatus;
  sortColumn: SortColumn;
  sortDirection: 'asc' | 'desc';
};

export const useFilteredItems = ({
  filterStatus,
  sortColumn,
  sortDirection,
}: UseFilteredItemsProps): DataModelGenerationQueue[] => {
  const dataModelQueue = useAppSelector((state) => state.dataModelGenerationQueue);
  const projects = useAppSelector((state) => state.projects);
  const repos = useAppSelector((state) => state.projectRepos);
  const entities = useAppSelector((state) => state.dataEntities);

  const getProjectName = useCallback(
    (projectId: string | undefined): string => {
      if (!projectId) return '—';
      return projects.find((p) => p.id === projectId)?.name ?? truncateId(projectId);
    },
    [projects]
  );

  const getRepoName = useCallback(
    (repoId: string | undefined): string => {
      if (!repoId) return '—';
      return repos.find((r) => r.id === repoId)?.name ?? truncateId(repoId);
    },
    [repos]
  );

  const getEntityName = useCallback(
    (entityId: string | undefined): string => {
      if (!entityId) return '—';
      return (
        Object.values(entities).find((e) => e.id === entityId)?.name ??
        truncateId(entityId)
      );
    },
    [entities]
  );

  const filteredItems = useMemo(() => {
    let filtered =
      filterStatus === 'all'
        ? dataModelQueue
        : dataModelQueue.filter((item) => item.status === filterStatus);

    filtered = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'project':
          aValue = getProjectName(a.project_id).toLowerCase();
          bValue = getProjectName(b.project_id).toLowerCase();
          break;
        case 'repo':
          aValue = getRepoName(a.repo_id).toLowerCase();
          bValue = getRepoName(b.repo_id).toLowerCase();
          break;
        case 'entity':
          aValue = getEntityName(a.entity_id).toLowerCase();
          bValue = getEntityName(b.entity_id).toLowerCase();
          break;
        case 'file_path':
          aValue = a.file_path.toLowerCase();
          bValue = b.file_path.toLowerCase();
          break;
        case 'scheduled_at':
          aValue = new Date(a.scheduled_at).getTime();
          bValue = new Date(b.scheduled_at).getTime();
          break;
        case 'started_at':
          aValue = a.started_at ? new Date(a.started_at).getTime() : 0;
          bValue = b.started_at ? new Date(b.started_at).getTime() : 0;
          break;
        case 'completed_at':
          aValue = a.completed_at ? new Date(a.completed_at).getTime() : 0;
          bValue = b.completed_at ? new Date(b.completed_at).getTime() : 0;
          break;
        case 'error':
          aValue = (a.error_message || '').toLowerCase();
          bValue = (b.error_message || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    dataModelQueue,
    filterStatus,
    sortColumn,
    sortDirection,
    getProjectName,
    getRepoName,
    getEntityName,
  ]);

  return filteredItems;
};
