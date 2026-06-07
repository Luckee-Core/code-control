'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  getAllARDGenerationQueueThunk,
  createBatchARDQueueThunk,
} from '@/store/thunks/ard-generation-queue';
import { getAllARDTasksThunk } from '@/store/thunks/ard-tasks';
import { BuildFoundationBuilderActions } from '@/store/builders';
import { ARDTableRow } from './row';
import { ARDTableHeader } from './TableHeader';
import { FolderOpen, Search } from 'lucide-react';
import { styles } from './styles';

export const ARDTable = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeGuidedRepoId = useAppSelector(
    (state) => state.workspaceBuilder.activeGuidedRepoId
  );
  const currentProject = useAppSelector((state) => state.currentProject);
  const allARDTasks = useAppSelector((state) => state.ardTasks);
  const ardQueue = useAppSelector((state) =>
    state.ardGenerationQueue.filter((t) => t.repo_id === activeGuidedRepoId)
  );
  const selectedARDTaskIds = useAppSelector(
    (state) => state.buildFoundationBuilder.selectedARDTaskIds
  );
  const isGenerating = useAppSelector(
    (state) => state.buildFoundationBuilder.isGeneratingARDs
  );
  const repos = useAppSelector((state) => state.projectRepos);

  // Load ARD tasks when component mounts
  useEffect(() => {
    if (!activeGuidedRepoId) {
      console.log('No active repo ID');
      return;
    }

    dispatch(getAllARDTasksThunk());
  }, [activeGuidedRepoId, dispatch]);

  // Filter ARD tasks by stack_type matching the repo's repo_type
  const ardTasks = useMemo(() => {
    if (!activeGuidedRepoId) {
      console.log('🔍 ARDTable: No active repo ID');
      return [];
    }
    
    const currentRepo = repos.find((r) => r.id === activeGuidedRepoId);
    if (!currentRepo || !currentRepo.repo_type) {
      console.log('🔍 ARDTable: No repo found or no repo_type');
      return [];
    }
    
    console.log('🔍 ARDTable: Filtering tasks by stack_type:', currentRepo.repo_type);
    const filtered = allARDTasks.filter((t) => t.stack_type === currentRepo.repo_type);
    console.log('🔍 ARDTable: Filtered tasks:', filtered.length);
    
    return filtered;
  }, [allARDTasks, activeGuidedRepoId, repos]);

  const getTaskStatus = (taskId: string) => {
    const queueItem = ardQueue.find((q) => q.task_id === taskId);
    return queueItem?.status ?? null;
  };

  const selectedReady = selectedARDTaskIds.filter((id) => !getTaskStatus(id)).length;
  const isProcessing = ardTasks.some((task) => {
    const s = getTaskStatus(task.id);
    return s === 'queued' || s === 'processing';
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      dispatch(getAllARDGenerationQueueThunk()),
      dispatch(getAllARDTasksThunk()),
    ]);
    setIsRefreshing(false);
  };

  const handleGenerate = async () => {
    if (
      selectedARDTaskIds.length === 0 ||
      !currentProject ||
      !activeGuidedRepoId
    )
      return;

    console.log('🚀 ARDTable: Starting batch generation');
    console.log('🚀 Selected task IDs:', selectedARDTaskIds);
    console.log('🚀 Project ID:', currentProject.id);
    console.log('🚀 Repo ID:', activeGuidedRepoId);

    dispatch(BuildFoundationBuilderActions.setIsGeneratingARDs(true));

    const status = await dispatch(
      createBatchARDQueueThunk({
        project_id: currentProject.id,
        repo_id: activeGuidedRepoId,
        task_ids: selectedARDTaskIds,
      })
    );

    console.log('🚀 Batch generation result:', status);

    if (status === 200) {
      dispatch(BuildFoundationBuilderActions.setSelectedARDTaskIds([]));
      // Refresh the queue to get the newly created items
      await dispatch(getAllARDGenerationQueueThunk());
    }

    dispatch(BuildFoundationBuilderActions.setIsGeneratingARDs(false));
  };

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return ardTasks;
    const q = search.toLowerCase();
    return ardTasks.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q) ||
        t.output_path_template.toLowerCase().includes(q)
    );
  }, [ardTasks, search]);

  if (ardTasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FolderOpen className={styles.emptyStateIcon} />
        <p className={styles.emptyStateText}>No ARD tasks for this repo type</p>
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
            placeholder="Search by file, description, or path…"
            className={styles.searchInput}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={selectedReady === 0 || isProcessing}
          className={styles.generateButton}
        >
          {isProcessing || isGenerating
            ? 'Generating…'
            : `Generate Selected (${selectedReady})`}
        </button>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={styles.refreshButton}
        >
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <ARDTableHeader />
          <tbody className="divide-y divide-border">
            {filteredTasks.map((task) => (
              <ARDTableRow key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
