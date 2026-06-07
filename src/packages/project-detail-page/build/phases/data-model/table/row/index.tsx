'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { DataModelBuilderActions } from '@/store/builders';
import { deleteDataModelQueueItemThunk } from '@/store/thunks';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import type { DataEntityWithFields, DataModelQueueStatus } from '@/model';
import { TemplateTab } from './template';
import { ErrorTab } from './error';

const statusLabel = (status: DataModelQueueStatus | null) => {
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
  entity: DataEntityWithFields;
  queueItem?: {
    id: string;
    status: DataModelQueueStatus;
    error_message: string | null;
    pr_link: string | null;
  } | null;
};

export const DataModelQueueRow = ({ entity, queueItem }: Props) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'template' | 'error'>('template');
  
  const selectedEntityIds = useAppSelector((state) => state.dataModelBuilder.selectedEntityIds);

  const status = queueItem?.status ?? null;
  const errorMessage = queueItem?.error_message ?? null;
  const prLink = queueItem?.pr_link ?? null;
  const isSelected = selectedEntityIds.includes(entity.id);
  const hasError = status === 'failed' && errorMessage;

  const handleToggle = () => {
    dispatch(DataModelBuilderActions.toggleEntitySelection(entity.id));
  };

  const handleDelete = async () => {
    if (!queueItem) return;
    if (!confirm('Are you sure you want to delete this queue item?')) return;
    
    const result = await dispatch(deleteDataModelQueueItemThunk(queueItem.id));
    if (result !== 200) {
      alert('Failed to delete queue item');
    }
  };

  const fileName = entity.name.toLowerCase().replace(/\s+/g, '-');
  const filePath = `src/model/${fileName}.ts`;

  return (
    <>
      <tr className={styles.row}>
        <td className="px-4 py-3 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            className={styles.checkbox}
          />
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
            <span className={styles.fileCell}>{entity.name}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={styles.descriptionCell}>
            {entity.description || `TypeScript model for ${entity.name}`}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={styles.pathCell}>{filePath}</span>
        </td>
        <td className="px-4 py-3">
          <div className={styles.statusCell}>
            <span className={styles.statusBadge(status)}>{statusLabel(status)}</span>
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
        <td className="px-4 py-3">
          {prLink ? (
            <a
              href={prLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.prLink}
            >
              View PR →
            </a>
          ) : (
            <span className={styles.noPr}>—</span>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className={styles.expandedCell}>
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
                <TemplateTab entity={entity} filePath={filePath} />
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

const styles = {
  row: `
    border-b border-border hover:bg-accent/50 transition-colors
  `,
  checkbox: `
    h-4 w-4 rounded border-input cursor-pointer
  `,
  nameCell: `
    flex items-center gap-2
  `,
  expandButton: `
    text-muted-foreground hover:text-foreground transition-colors
  `,
  fileCell: `
    text-sm font-medium text-foreground
  `,
  descriptionCell: `
    text-sm text-muted-foreground
  `,
  pathCell: `
    text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded
  `,
  statusCell: `
    flex items-center gap-2
  `,
  deleteButton: `
    shrink-0 p-1.5 rounded text-xs font-medium
    bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors
  `,
  statusBadge: (status: DataModelQueueStatus | null) => {
    const baseClasses = 'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium';
    switch (status) {
      case null:
        return `${baseClasses} bg-muted text-muted-foreground`;
      case 'queued':
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
      case 'processing':
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
      case 'completed':
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200`;
      case 'failed':
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      default:
        return baseClasses;
    }
  },
  prLink: `
    text-xs text-primary hover:underline font-medium
  `,
  noPr: `
    text-xs text-muted-foreground
  `,
  expandedCell: `
    bg-muted/30 px-4 py-4 border-b border-border
  `,
  expandedContent: `
    max-w-4xl
  `,
  tabContainer: `
    flex gap-1 border-b border-border mb-4
  `,
  tab: (isActive: boolean) => `
    px-4 py-2 text-sm font-medium transition-colors
    ${isActive 
      ? 'text-primary border-b-2 border-primary' 
      : 'text-muted-foreground hover:text-foreground'
    }
  `,
};
