/**
 * CRUD API Queue Item Row
 *
 * One table row per queue item (one per operation). Checkbox for selection,
 * entity, operation, file path, status, retry/delete actions, error, PR, created.
 */

'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { CrudApiBuilderActions } from '@/store/builders/crudApiBuilder';
import {
  retryCrudApiQueueItemThunk,
  deleteCrudApiQueueItemThunk,
  mergeCrudApiQueueItemPrThunk,
} from '@/store/thunks/crud-api-generation-queue';
import type { CrudApiGenerationQueue } from '@/model/crud-api-generation-queue';
import type { DataEntityWithFields } from '@/model';
import { RotateCcw, Trash2 } from 'lucide-react';

type CrudApiQueueItemRowProps = {
  item: CrudApiGenerationQueue;
  entity: DataEntityWithFields | null;
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'queued':
      return 'Queued';
    case 'processing':
      return 'Processing';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'queued':
      return styles.statusQueued;
    case 'processing':
      return styles.statusProcessing;
    case 'completed':
      return styles.statusCompleted;
    case 'failed':
      return styles.statusFailed;
    default:
      return styles.statusReady;
  }
};

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
};

export const CrudApiQueueItemRow = ({ item, entity }: CrudApiQueueItemRowProps) => {
  const dispatch = useAppDispatch();
  const [showError, setShowError] = useState(false);
  const [mergeLoading, setMergeLoading] = useState(false);
  const [mergeResult, setMergeResult] = useState<'merged' | null>(null);
  const [mergeError, setMergeError] = useState<string | null>(null);

  const selectedQueueItemIds = useAppSelector((state) => state.crudApiBuilder.selectedCrudApiQueueItemIds);
  const isSelected = selectedQueueItemIds.includes(item.id);

  const entityName =
    item.entity_id == null
      ? (item.operation_key === 'table_names_config' ? 'Table names config' : item.operation_key ?? 'Repo-level')
      : (entity?.name ?? item.entity_id);

  const handleToggleSelect = () => {
    dispatch(CrudApiBuilderActions.toggleCrudApiQueueItemSelection(item.id));
  };

  const handleRetry = async () => {
    if (item.status !== 'failed') return;
    await dispatch(retryCrudApiQueueItemThunk(item.id));
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this queue item?')) return;
    await dispatch(deleteCrudApiQueueItemThunk(item.id));
  };

  const handleMergePr = async () => {
    if (!item.pr_link || item.status !== 'completed') return;
    setMergeError(null);
    setMergeLoading(true);
    const result = await dispatch(mergeCrudApiQueueItemPrThunk(item.id));
    setMergeLoading(false);
    if (result.status === 200) {
      setMergeResult('merged');
    } else {
      setMergeError(result.error ?? 'Merge failed');
    }
  };

  return (
    <tr className={styles.tr}>
      <td className={styles.tdCheckbox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
          className={styles.checkbox}
        />
      </td>
      <td className={styles.td}>
        <span className={styles.entityName}>{entityName}</span>
        {entity?.table_name && (
          <div className={styles.entityTable}>{entity.table_name}</div>
        )}
      </td>
      <td className={styles.td}>
        <span className={styles.operationBadge}>{item.operation_key}</span>
      </td>
      <td className={styles.td}>
        <code className={styles.filePath}>{item.file_path}</code>
      </td>
      <td className={styles.td}>
        <div className={styles.statusCell}>
          <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
            {statusLabel(item.status)}
          </span>
          {item.status === 'failed' && (
            <button
              type="button"
              onClick={handleRetry}
              className={styles.retryButton}
              title="Retry"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteButton}
            title="Delete queue item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
      <td className={styles.td}>
        {item.error ? (
          <div className={styles.errorCell}>
            <button
              type="button"
              onClick={() => setShowError(!showError)}
              className={styles.errorToggle}
            >
              {showError ? 'Hide' : 'Show'} error
            </button>
            {showError && (
              <div className={styles.errorMessage}>{item.error}</div>
            )}
          </div>
        ) : (
          <span className={styles.noError}>—</span>
        )}
      </td>
      <td className={styles.td}>
        <div className={styles.prCell}>
          {item.pr_link ? (
            <>
              <div className={styles.prRow}>
                <a
                  href={item.pr_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.prLink}
                >
                  View PR
                </a>
                {item.status === 'completed' && (
                  <>
                    <span className={styles.prSeparator}>·</span>
                    {mergeResult === 'merged' ? (
                      <span className={styles.mergedLabel}>Merged</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMergePr}
                        disabled={mergeLoading}
                        className={styles.mergeButton}
                        title="Merge PR"
                      >
                        {mergeLoading ? 'Merging…' : 'Merge PR'}
                      </button>
                    )}
                  </>
                )}
              </div>
              {mergeError && (
                <div className={styles.mergeError}>{mergeError}</div>
              )}
            </>
          ) : (
            <span className={styles.prEmpty}>—</span>
          )}
        </div>
      </td>
      <td className={styles.td}>
        <span className={styles.date}>{formatDate(item.created_at)}</span>
      </td>
    </tr>
  );
};

const styles = {
  tr: `
    hover:bg-gray-50 transition-colors
  `,
  tdCheckbox: `
    px-4 py-3 text-center border-b border-gray-200 w-12
  `,
  checkbox: `
    h-4 w-4 rounded border-gray-300 text-blue-600
    focus:ring-blue-500 cursor-pointer
  `,
  td: `
    px-4 py-3 text-sm text-gray-700 border-b border-gray-200
  `,
  statusCell: `
    flex items-center gap-2
  `,
  retryButton: `
    p-1.5 rounded text-gray-500 hover:bg-amber-100 hover:text-amber-700
    transition-colors
  `,
  deleteButton: `
    p-1.5 rounded text-gray-500 hover:bg-red-100 hover:text-red-700
    transition-colors
  `,
  entityName: `
    font-medium text-gray-900
  `,
  entityTable: `
    text-xs text-gray-500 mt-0.5
  `,
  operationBadge: `
    px-2 py-0.5 text-xs rounded
    bg-blue-100 text-blue-700
  `,
  filePath: `
    text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded
  `,
  statusBadge: `
    px-2 py-1 text-xs font-medium rounded-full
  `,
  statusReady: `
    bg-gray-100 text-gray-700
  `,
  statusQueued: `
    bg-blue-100 text-blue-700
  `,
  statusProcessing: `
    bg-yellow-100 text-yellow-700
  `,
  statusCompleted: `
    bg-green-100 text-green-700
  `,
  statusFailed: `
    bg-red-100 text-red-700
  `,
  errorCell: `
    max-w-xs
  `,
  errorToggle: `
    text-xs text-amber-600 hover:underline cursor-pointer
  `,
  errorMessage: `
    mt-1 text-xs text-red-700 bg-red-50 p-2 rounded break-words
  `,
  noError: `
    text-gray-400
  `,
  prCell: `
    flex flex-col gap-0.5
  `,
  prRow: `
    flex items-center gap-1 flex-wrap
  `,
  prLink: `
    text-blue-600 hover:underline text-sm
  `,
  prSeparator: `
    text-gray-400 text-sm
  `,
  mergeButton: `
    text-xs text-green-700 hover:text-green-800 hover:underline
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
  `,
  mergedLabel: `
    text-xs text-gray-500 italic
  `,
  mergeError: `
    text-xs text-amber-600 mt-0.5
  `,
  prEmpty: `
    text-gray-400
  `,
  date: `
    text-gray-500 text-xs
  `,
};
