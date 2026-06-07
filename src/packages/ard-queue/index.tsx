'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import type { ARDGenerationQueueItem } from '@/model/ard-generation-queue';
import { formatDateTimeWithTime } from '@/utils/date-time';

type ARDQueueStatus = 'queued' | 'processing' | 'completed' | 'failed';

const STATUS_OPTIONS: { value: 'all' | ARDQueueStatus; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'queued', label: 'Queued' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const getStatusColor = (status: ARDQueueStatus): string => {
  switch (status) {
    case 'queued':
      return 'bg-gray-100 text-gray-700';
    case 'processing':
      return 'bg-blue-100 text-blue-700';
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const ARDQueuePage = () => {
  const router = useRouter();
  const ardQueue = useAppSelector((state) => state.ardGenerationQueue);
  const projects = useAppSelector((state) => state.projects);
  const repos = useAppSelector((state) => state.projectRepos);
  
  const [filterStatus, setFilterStatus] = useState<'all' | ARDQueueStatus>('all');
  const [sortColumn, setSortColumn] = useState<
    'status' | 'project' | 'repo' | 'task' | 'scheduled_at' | 'started_at' | 'completed_at' | 'error'
  >('scheduled_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getProjectName = (projectId: string): string => {
    return projects.find((p) => p.id === projectId)?.name ?? projectId.slice(0, 8) + '…';
  };

  const getRepoName = (repoId: string): string => {
    return repos.find((r) => r.id === repoId)?.name ?? repoId.slice(0, 8) + '…';
  };

  const getTaskName = (taskId: string): string => {
    return taskId.slice(0, 8) + '…';
  };

  const getProjectCustomerId = (projectId: string): string | null => {
    return projects.find((p) => p.id === projectId)?.workspace_id ?? null;
  };

  const filteredItems = useMemo(() => {
    let filtered =
      filterStatus === 'all'
        ? ardQueue
        : ardQueue.filter((item) => item.status === filterStatus);

    filtered = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'project':
          aValue = getProjectName(a.project_id).toLowerCase();
          bValue = getProjectName(b.project_id).toLowerCase();
          break;
        case 'repo':
          aValue = getRepoName(a.repo_id).toLowerCase();
          bValue = getRepoName(b.repo_id).toLowerCase();
          break;
        case 'task':
          aValue = getTaskName(a.task_id).toLowerCase();
          bValue = getTaskName(b.task_id).toLowerCase();
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
  }, [ardQueue, filterStatus, sortColumn, sortDirection]);

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.filters}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className={styles.filterSelect}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.rightControls}>
          <span className={styles.count}>
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No ARD queue items found</p>
          <p className={styles.emptyHint}>
            Add items from a project&apos;s build foundation page.
          </p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('status')}
                >
                  <div className={styles.headerContent}>
                    Status
                    {sortColumn === 'status' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('project')}
                >
                  <div className={styles.headerContent}>
                    Project
                    {sortColumn === 'project' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('repo')}
                >
                  <div className={styles.headerContent}>
                    Repo
                    {sortColumn === 'repo' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('task')}
                >
                  <div className={styles.headerContent}>
                    Task
                    {sortColumn === 'task' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('scheduled_at')}
                >
                  <div className={styles.headerContent}>
                    Scheduled
                    {sortColumn === 'scheduled_at' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('started_at')}
                >
                  <div className={styles.headerContent}>
                    Started
                    {sortColumn === 'started_at' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('completed_at')}
                >
                  <div className={styles.headerContent}>
                    Completed
                    {sortColumn === 'completed_at' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('error')}
                >
                  <div className={styles.headerContent}>
                    Error
                    {sortColumn === 'error' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${getStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={styles.clickableName}
                      onClick={() => handleViewProject(item.project_id)}
                    >
                      {getProjectName(item.project_id)}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{getRepoName(item.repo_id)}</td>
                  <td className={styles.tableCell}>{getTaskName(item.task_id)}</td>
                  <td className={styles.tableCell}>
                    {formatDateTimeWithTime(item.scheduled_at)}
                  </td>
                  <td className={styles.tableCell}>
                    {item.started_at ? formatDateTimeWithTime(item.started_at) : 'N/A'}
                  </td>
                  <td className={styles.tableCell}>
                    {item.completed_at ? formatDateTimeWithTime(item.completed_at) : 'N/A'}
                  </td>
                  <td className={styles.tableCell}>
                    {item.error_message ? (
                      <span className={styles.errorText} title={item.error_message}>
                        {item.error_message.length > 50
                          ? `${item.error_message.substring(0, 50)}...`
                          : item.error_message}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
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
    w-full space-y-3 p-2
  `,
  controls: `
    flex items-center justify-between gap-4
  `,
  filters: `
    flex gap-2 items-center
  `,
  rightControls: `
    flex items-center gap-3
  `,
  count: `
    text-xs text-gray-500
  `,
  filterSelect: `
    h-7 px-2 py-1 text-xs
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
    bg-white
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
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  table: `
    w-full border-collapse text-xs
  `,
  tableHeaderCell: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
  sortableHeader: `
    cursor-pointer hover:bg-gray-200 transition-colors
    user-select-none
  `,
  headerContent: `
    flex items-center gap-1
  `,
  sortIndicator: `
    text-gray-500 text-xs
  `,
  tableRow: `
    hover:bg-gray-50 transition-colors
    border-b border-gray-200 last:border-b-0
  `,
  tableCell: `
    px-3 py-2 text-xs text-gray-700
  `,
  statusBadge: `
    text-[10px] font-medium px-1.5 py-0.5 rounded border
    inline-block
  `,
  clickableName: `
    text-blue-600 hover:text-blue-800 hover:underline
    transition-colors text-xs cursor-pointer
  `,
  errorText: `
    text-red-600 text-xs
  `,
};
