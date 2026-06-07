import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { formatDateTimeWithTime } from '@/utils/date-time';
import type { DataModelGenerationQueue } from '@/model';

type DataModelQueueStatus = 'queued' | 'processing' | 'completed' | 'failed';

type DataModelQueueRowProps = {
  item: DataModelGenerationQueue;
};

const getStatusColor = (status: DataModelQueueStatus | null): string => {
  if (!status) return 'bg-gray-100 text-gray-700';
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

export const DataModelQueueRow = ({ item }: DataModelQueueRowProps) => {
  const router = useRouter();
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  
  const projects = useAppSelector((state) => state.projects);
  const repos = useAppSelector((state) => state.projectRepos);
  const entities = useAppSelector((state) => state.dataEntities);

  const projectName =
    projects.find((p) => p.id === item.project_id)?.name ?? item.project_id.slice(0, 8) + '…';
  const repoName =
    repos.find((r) => r.id === item.repo_id)?.name ?? item.repo_id.slice(0, 8) + '…';
  const entityName =
    Object.values(entities).find((e) => e.id === item.entity_id)?.name ??
    (item.entity_id.slice(0, 8) + '…' || item.entity_id);

  const handleViewProject = () => {
    router.push(`/projects/${item.project_id}`);
  };

  return (
    <tr className={styles.tableRow}>
      <td className={styles.tableCell}>
        <span className={`${styles.statusBadge} ${getStatusColor(item.status)}`}>
          {item.status ? item.status.toUpperCase() : 'PENDING'}
        </span>
      </td>
      <td className={styles.tableCell}>
        <span className={styles.clickableName} onClick={handleViewProject}>
          {projectName}
        </span>
      </td>
      <td className={styles.tableCell}>{repoName}</td>
      <td className={styles.tableCell}>{entityName}</td>
      <td className={styles.tableCell}>
        <code className={styles.filePath}>{item.file_path}</code>
      </td>
      <td className={styles.tableCell}>{formatDateTimeWithTime(item.scheduled_at)}</td>
      <td className={styles.tableCell}>
        {item.started_at ? formatDateTimeWithTime(item.started_at) : 'N/A'}
      </td>
      <td className={styles.tableCell}>
        {item.completed_at ? formatDateTimeWithTime(item.completed_at) : 'N/A'}
      </td>
      <td className={styles.tableCell}>
        {item.error_message ? (
          <div
            className={styles.errorContainer}
            onMouseEnter={() => setShowErrorTooltip(true)}
            onMouseLeave={() => setShowErrorTooltip(false)}
          >
            <span className={styles.errorText}>
              {item.error_message.length > 50
                ? `${item.error_message.substring(0, 50)}...`
                : item.error_message}
            </span>
            {showErrorTooltip && (
              <div className={styles.tooltip}>
                <div className={styles.tooltipContent}>{item.error_message}</div>
              </div>
            )}
          </div>
        ) : (
          'N/A'
        )}
      </td>
    </tr>
  );
};

const styles = {
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
  filePath: `
    text-[10px] bg-gray-100 px-1 py-0.5 rounded font-mono
  `,
  errorContainer: `
    relative inline-block
  `,
  errorText: `
    text-red-600 text-xs cursor-help
  `,
  tooltip: `
    absolute z-50 left-0 bottom-full mb-2
    min-w-[300px] max-w-[500px]
    pointer-events-none
  `,
  tooltipContent: `
    bg-gray-900 text-white text-xs p-3 rounded shadow-lg
    break-words whitespace-pre-wrap
    border border-gray-700
  `,
};
