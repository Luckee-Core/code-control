'use client';

import type { DataModelQueueStatus } from '@/model';

type StatusBadgeProps = {
  status: DataModelQueueStatus | null;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) {
    return <span className={styles.ready}>Ready</span>;
  }

  const statusConfig: Record<DataModelQueueStatus, { label: string; style: string }> = {
    queued: { label: 'Queued', style: styles.queued },
    processing: { label: 'Processing', style: styles.processing },
    completed: { label: 'Completed', style: styles.completed },
    failed: { label: 'Failed', style: styles.failed },
  };

  const config = statusConfig[status];

  return <span className={config.style}>{config.label}</span>;
};

const styles = {
  ready: `
    text-gray-400 text-xs
  `,
  queued: `
    px-2 py-1 rounded text-xs font-medium
    text-blue-600 bg-blue-50
  `,
  processing: `
    px-2 py-1 rounded text-xs font-medium
    text-orange-600 bg-orange-50
  `,
  completed: `
    px-2 py-1 rounded text-xs font-medium
    text-green-600 bg-green-50
  `,
  failed: `
    px-2 py-1 rounded text-xs font-medium
    text-red-600 bg-red-50
  `,
};
