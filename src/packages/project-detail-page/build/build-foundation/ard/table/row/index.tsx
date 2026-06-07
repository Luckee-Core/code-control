'use client';

import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { BuildFoundationBuilderActions } from '@/store/builders';
import { retryARDQueueItemThunk, deleteARDQueueItemThunk } from '@/store/thunks/ard-generation-queue';
import { useToast } from '@/components/shared';
import { CheckCircle2, Circle, Loader2, AlertCircle, Clock, RotateCcw, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import type { ARDTask } from '@/model';
import { TemplateTab } from './template';
import { ErrorTab } from './error';
import { styles } from './styles';

const statusIcon = (status: string | null) => {
  switch (status) {
    case null:
      return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
    case 'queued':
      return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
    case 'processing':
      return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />;
    case 'completed':
      return <CheckCircle2 className="h-3.5 w-3.5 text-status-done" />;
    case 'failed':
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
    default:
      return null;
  }
};

const statusLabel = (status: string | null) => {
  switch (status) {
    case null:
      return 'Ready';
    case 'queued':
      return 'Queued';
    case 'processing':
      return 'Processing…';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return '—';
  }
};

type Props = {
  task: ARDTask;
};

export const ARDTableRow = ({ task }: Props) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'template' | 'error'>('template');
  
  const activeGuidedRepoId = useAppSelector(
    (state) => state.workspaceBuilder.activeGuidedRepoId
  );
  const ardQueue = useAppSelector((state) =>
    state.ardGenerationQueue.filter((t) => t.repo_id === activeGuidedRepoId)
  );
  const selectedARDTaskIds = useAppSelector(
    (state) => state.buildFoundationBuilder.selectedARDTaskIds
  );
  const allConventions = useAppSelector((state) => state.buildConventions);
  const buildStepsRecord = useAppSelector((state) => state.buildSteps);
  const taskCategoriesRecord = useAppSelector((state) => state.taskCategories);
  const stepTaskCategoriesRecord = useAppSelector((state) => state.stepTaskCategories);
  const conventionTaskCategories = useAppSelector((state) => state.conventionTaskCategories);

  const queueItem = ardQueue.find((q) => q.task_id === task.id);
  const status = queueItem?.status ?? null;
  const errorMessage = queueItem?.error_message ?? null;
  const isSelected = selectedARDTaskIds.includes(task.id);
  const hasError = status === 'failed' && errorMessage;

  // Convert Records to Arrays
  const buildSteps = useMemo(() => Object.values(buildStepsRecord), [buildStepsRecord]);
  const taskCategories = useMemo(() => Object.values(taskCategoriesRecord), [taskCategoriesRecord]);
  const stepTaskCategories = useMemo(() => Object.values(stepTaskCategoriesRecord), [stepTaskCategoriesRecord]);

  // Find the ARD build step
  const ardBuildStep = useMemo(() => {
    return buildSteps.find((step) => step.name === 'ARDs');
  }, [buildSteps]);

  // Get task categories for the ARD build step
  const relevantTaskCategories = useMemo(() => {
    if (!ardBuildStep) return [];
    
    const categoryIds = stepTaskCategories
      .filter((stc) => stc.build_step_id === ardBuildStep.id)
      .map((stc) => stc.task_category_id);
    
    return taskCategories.filter((tc) => categoryIds.includes(tc.id));
  }, [ardBuildStep, stepTaskCategories, taskCategories]);

  // Filter conventions by relevant task categories
  const buildProfileConventions = useMemo(() => {
    if (relevantTaskCategories.length === 0) return [];
    
    const categoryIds = relevantTaskCategories.map((tc) => tc.id);
    
    return allConventions.filter((conv) => {
      return conventionTaskCategories.some(
        (ctc) => ctc.convention_id === conv.id && categoryIds.includes(ctc.task_category_id)
      );
    });
  }, [allConventions, conventionTaskCategories, relevantTaskCategories]);

  const handleToggle = () => {
    console.log('🔵 ARDTableRow: Toggling task selection');
    console.log('🔵 Task ID:', task.id);
    console.log('🔵 Task name:', task.name);
    console.log('🔵 Task type:', task.task_type);
    console.log('🔵 Currently selected:', isSelected);
    dispatch(BuildFoundationBuilderActions.toggleARDTask(task.id));
  };

  const handleRetry = async () => {
    if (!queueItem || status !== 'failed') return;
    const result = await dispatch(retryARDQueueItemThunk(queueItem.id));
    if (result === 200) {
      showToast('Retrying ARD generation', 'success');
    }
  };

  const handleDelete = async () => {
    if (!queueItem) return;
    if (!confirm('Are you sure you want to delete this queue item?')) return;
    const result = await dispatch(deleteARDQueueItemThunk(queueItem.id));
    if (result === 200) {
      showToast('Queue item deleted', 'success');
    } else {
      showToast('Failed to delete queue item', 'error');
    }
  };

  return (
    <>
      <tr className={styles.row}>
        <td className="px-4 py-3 text-center">
          {!status ? (
            <button
              type="button"
              onClick={handleToggle}
              className={styles.checkboxButton(isSelected)}
            >
              {isSelected && <CheckCircle2 className="h-3 w-3" />}
            </button>
          ) : (
            statusIcon(status)
          )}
        </td>
        <td className="px-4 py-3">
          <div className={styles.nameCell}>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.expandButton}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <span className={styles.fileCell}>{task.name}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={styles.descriptionCell}>{task.description ?? '—'}</span>
        </td>
        <td className="px-4 py-3">
          <span className={styles.pathCell}>{task.output_path_template}</span>
        </td>
        <td className="px-4 py-3">
          <div className={styles.statusCell}>
            <span className={styles.statusBadge(status)}>{statusLabel(status)}</span>
            {status === 'failed' && (
              <button
                type="button"
                onClick={handleRetry}
                className={styles.retryButton}
                title="Retry"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            {queueItem && (
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
                title="Delete queue item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className={styles.expandedCell}>
            <div className={styles.expandedContent}>
              {hasError && (
                <div className={styles.tabContainer}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('template')}
                    className={styles.tab(activeTab === 'template')}
                  >
                    Prompt Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('error')}
                    className={styles.tab(activeTab === 'error')}
                  >
                    Error Details
                  </button>
                </div>
              )}
              {activeTab === 'template' ? (
                <TemplateTab 
                  promptTemplate={task.prompt_template}
                  conventionsCount={buildProfileConventions.length}
                />
              ) : (
                <ErrorTab errorMessage={errorMessage!} />
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
