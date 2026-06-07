'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import type { DataEntityWithFields } from '@/model/data-entity';
import {
  deleteDataEntityThunk,
  fetchCursorGenerationExchangesByEntityThunk,
} from '@/store/thunks';
import { getReposByProjectId } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import type { ProjectRepo } from '@/api/project-setup';
import { AddFieldForm } from './AddFieldForm';
import { EntityFieldRow } from './EntityFieldRow';
import { getTaskTypesForPhase } from './phaseConfig';

type EntityCardProps = {
  entity: DataEntityWithFields;
  currentPhase?: string;
  platformId?: string;
  showCodeGeneration?: boolean;
};

export const EntityCard = ({
  entity,
  currentPhase,
  platformId,
  showCodeGeneration = true,
}: EntityCardProps) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [repos, setRepos] = useState<ProjectRepo[]>([]);

  const currentProject = useAppSelector((state) => state.currentProject);
  const cursorExchanges = useAppSelector((state) => state.cursorGenerationExchanges);

  const fields = entity.fields ?? [];

  // Stubbed variables - code generation moved to DataModelPhase
  const generationTasks: any[] = [];
  const selectedTasks: any[] = [];

  const taskTypesForPhase = currentPhase ? getTaskTypesForPhase(currentPhase) : null;
  const tasksToShow = taskTypesForPhase?.length
    ? generationTasks.filter((t) => taskTypesForPhase.includes(t.task_type))
    : generationTasks;

  useEffect(() => {
    const fetchRepos = async () => {
      if (!currentProject?.id) return;
      const res = await getReposByProjectId(currentProject.id, getApiBaseUrl());
      if (res.success && res.data) setRepos(res.data);
    };
    void fetchRepos();
  }, [currentProject?.id]);

  useEffect(() => {
    if (entity.id && selectedTasks.length > 0) {
      void dispatch(fetchCursorGenerationExchangesByEntityThunk(entity.id));
    }
  }, [entity.id, selectedTasks.length, dispatch]);

  const webRepo = repos.find((r) => r.repo_type === 'nextjs');
  const targetRepoId = platformId ?? webRepo?.id;

  const assignedRepoIds = entity.assigned_repo_ids ?? [];
  const assignedRepos = repos.filter((r) => assignedRepoIds.includes(r.id));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      void dispatch(deleteDataEntityThunk(entity.id));
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    // Code generation moved to DataModelPhase - this is now a no-op
    console.warn('Code generation has been moved to Data Model Phase');
  };

  const handleGenerate = async (taskId: string) => {
    // Code generation moved to DataModelPhase - this is now a no-op
    console.warn('Code generation has been moved to Data Model Phase');
  };

  const handleAddToQueue = async (taskId: string) => {
    // Code generation moved to DataModelPhase - this is now a no-op
    console.warn('Code generation has been moved to Data Model Phase');
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.header}
      >
        {isExpanded ? (
          <svg className={styles.chevron} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className={styles.chevron} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        <svg className={styles.packageIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className={styles.entityName}>{entity.name}</span>
        <span className={styles.tableName}>({entity.table_name})</span>
        {!showCodeGeneration && assignedRepos.length > 0 && (
          <div className={styles.repoBadges}>
            {assignedRepos.map((r) => (
              <span key={r.id} className={styles.repoBadge} title={r.name}>
                {r.name}
              </span>
            ))}
          </div>
        )}
        <div className={styles.spacer} />
        <span
          onClick={handleDelete}
          className={confirmDelete ? styles.deleteConfirm : styles.delete}
        >
          {confirmDelete && <span className={styles.deleteText}>Confirm delete?</span>}
          <svg className={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </span>
      </button>

      {isExpanded && (
        <div className={styles.content}>
          {/* Fields Section */}
          <div>
            <h4 className={styles.sectionTitle}>Fields</h4>
            {fields.length > 0 && (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeader}>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th}>Type</th>
                      <th className={styles.th}>References</th>
                      <th className={styles.thCenter}>Nullable</th>
                      <th className={styles.th}>Default</th>
                      <th className={styles.thAction}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field) => (
                      <EntityFieldRow key={field.id} entityId={entity.id} field={field} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {fields.length === 0 && (
              <p className={styles.emptyFields}>No fields yet. Add a field below.</p>
            )}

            <AddFieldForm entityId={entity.id} existingCount={fields.length} />
          </div>

          {/* Repo Assignment Info (Data tab only) */}
          {!showCodeGeneration && (
            <div className={styles.repoAssignmentInfo}>
              <div className={styles.repoAssignmentContent}>
                <p className={styles.repoAssignmentText}>
                  Assigned to:{' '}
                  {assignedRepos.length > 0
                    ? assignedRepos.map((r) => r.name).join(', ')
                    : 'No repos yet'}
                </p>
                <p className={styles.repoAssignmentHint}>
                  Code generation happens in the Build tab after assigning entities
                  to repos.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    WorkspaceBuilderActions.setActiveWorkspaceView('build')
                  )
                }
                className={styles.assignToReposLink}
              >
                Assign to repos
                <svg
                  className={styles.assignArrow}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Code Generation Section (Build tab only) */}
          {showCodeGeneration && tasksToShow.length > 0 && (
            <div>
              <h4 className={styles.sectionTitle}>Code Generation</h4>
              <div className={styles.tasksList}>
                {tasksToShow.map((task) => {
                  const selectedTask = selectedTasks.find((t) => t.task_id === task.id);
                  const isSelected = !!selectedTask;
                  const status = selectedTask?.status || 'pending';

                  return (
                    <div key={task.id} className={styles.taskRow}>
                      <label className={styles.taskLabel}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={status === 'generating'}
                          onChange={() => handleToggleTask(task.id)}
                          className={styles.checkbox}
                        />
                        {task.name}
                      </label>
                      <span className={styles.taskDescription}>{task.description}</span>
                      <div className={styles.spacer} />

                      {/* Status actions */}
                      {selectedTask && status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleGenerate(task.id)}
                            className={styles.generateButton}
                          >
                            Generate
                          </button>
                          <button
                            onClick={() => handleAddToQueue(task.id)}
                            className={styles.queueButton}
                          >
                            Add to Queue
                          </button>
                        </>
                      )}
                      {selectedTask && status === 'generating' && (
                        <span className={styles.statusGenerating}>
                          <svg className={styles.spinner} fill="none" viewBox="0 0 24 24">
                            <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating…
                        </span>
                      )}
                      {selectedTask && status === 'completed' && (
                        <div className={styles.completedSection}>
                          {selectedTask.pr_url && (
                            <a
                              href={selectedTask.pr_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.prLink}
                            >
                              View PR
                              <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                          {selectedTask.cursor_exchange_id && (() => {
                            const exchange = cursorExchanges.find(
                              (e) => e.id === selectedTask.cursor_exchange_id
                            );
                            if (!exchange) return null;
                            return (
                              <span className={styles.costMeta}>
                                {exchange.duration_seconds != null && (
                                  <span>{exchange.duration_seconds}s</span>
                                )}
                                {exchange.cost_estimate != null && (
                                  <span>~${exchange.cost_estimate.toFixed(2)}</span>
                                )}
                                {exchange.api_calls_count > 0 && (
                                  <span>{exchange.api_calls_count} API calls</span>
                                )}
                              </span>
                            );
                          })()}
                        </div>
                      )}
                      {selectedTask && status === 'failed' && (
                        <div className={styles.failedSection}>
                          <span className={styles.errorMessage}>
                            {selectedTask.error_message || 'Generation failed'}
                          </span>
                          <button
                            onClick={() => handleGenerate(task.id)}
                            className={styles.retryButton}
                          >
                            <svg className={styles.retryIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  card: `
    rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden
  `,
  header: `
    w-full flex items-center gap-2 px-4 py-3 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left
  `,
  chevron: `
    h-4 w-4 text-gray-500 shrink-0
  `,
  packageIcon: `
    h-4 w-4 text-blue-600 shrink-0
  `,
  entityName: `
    text-sm font-semibold text-gray-900
  `,
  tableName: `
    text-xs text-gray-500
  `,
  repoBadges: `
    flex items-center gap-1 ml-2
  `,
  repoBadge: `
    inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700
  `,
  spacer: `
    flex-1
  `,
  delete: `
    text-xs cursor-pointer transition-colors text-gray-500 hover:text-red-600
  `,
  deleteConfirm: `
    text-xs cursor-pointer transition-colors text-red-600 font-medium
  `,
  deleteText: `
    mr-1
  `,
  deleteIcon: `
    h-3.5 w-3.5 inline
  `,
  content: `
    p-4 space-y-4
  `,
  sectionTitle: `
    text-xs font-medium text-gray-500 uppercase tracking-wider mb-2
  `,
  tableWrap: `
    border border-gray-200 rounded-md overflow-hidden mb-3
  `,
  table: `
    w-full text-sm
  `,
  tableHeader: `
    bg-gray-50/30
  `,
  th: `
    text-left px-3 py-2 font-medium text-gray-500
  `,
  thCenter: `
    text-center px-3 py-2 font-medium text-gray-500
  `,
  thAction: `
    w-8
  `,
  emptyFields: `
    text-xs text-gray-500 mb-3
  `,
  repoAssignmentInfo: `
    rounded-md border border-gray-200 bg-gray-50 p-3 flex items-center justify-between gap-4
  `,
  repoAssignmentContent: `
    min-w-0
  `,
  repoAssignmentText: `
    text-xs font-medium text-gray-900
  `,
  repoAssignmentHint: `
    text-xs text-gray-500 mt-0.5
  `,
  assignToReposLink: `
    shrink-0 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium
    border-none bg-transparent cursor-pointer
  `,
  assignArrow: `
    h-3 w-3
  `,
  tasksList: `
    space-y-2
  `,
  taskRow: `
    flex items-center gap-3
  `,
  taskLabel: `
    inline-flex items-center gap-2 text-sm text-gray-900 cursor-pointer
  `,
  checkbox: `
    rounded border-gray-300
  `,
  taskDescription: `
    text-xs text-gray-500
  `,
  actionButtons: `
    flex items-center gap-2
  `,
  generateButton: `
    rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors
  `,
  queueButton: `
    rounded bg-gray-600 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 transition-colors
  `,
  statusGenerating: `
    inline-flex items-center gap-1.5 text-xs text-blue-600 font-medium
  `,
  spinner: `
    h-3 w-3 animate-spin
  `,
  spinnerCircle: `
    opacity-25
  `,
  spinnerPath: `
    opacity-75
  `,
  completedSection: `
    flex items-center gap-3
  `,
  prLink: `
    inline-flex items-center gap-1 text-xs text-blue-600 hover:underline
  `,
  externalIcon: `
    h-3 w-3
  `,
  costMeta: `
    flex items-center gap-2 text-xs text-gray-500
  `,
  failedSection: `
    flex items-center gap-2
  `,
  errorMessage: `
    text-xs text-red-600
  `,
  retryButton: `
    inline-flex items-center gap-1 rounded bg-orange-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-orange-700 transition-colors
  `,
  retryIcon: `
    h-3 w-3
  `,
};
