'use client';

import { useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { generateEntityTableSql } from '../build/phases/data-model/generateEntityTablesSql';
import type { DataEntityWithFields } from '@/model/data-entity';

type SqlPreviewPanelProps = {
  entity: DataEntityWithFields | null;
};

export const SqlPreviewPanel = ({ entity }: SqlPreviewPanelProps) => {
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.workspaceBuilder.isSqlPreviewCollapsed);
  const [copied, setCopied] = useState(false);

  const sql = useMemo(() => {
    if (!entity) return '';
    return generateEntityTableSql(entity);
  }, [entity]);

  const handleCopy = async () => {
    if (!sql) return;
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy SQL:', error);
      alert('Failed to copy to clipboard. Please try selecting and copying manually.');
    }
  };

  const toggleCollapse = () => {
    dispatch(WorkspaceBuilderActions.toggleSqlPreviewCollapsed());
  };

  if (isCollapsed) {
    return (
      <div className={styles.collapsedPanel}>
        <button
          type="button"
          onClick={toggleCollapse}
          className={styles.expandButton}
          title="Expand SQL Preview"
        >
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className={styles.verticalText}>SQL</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h4 className={styles.title}>SQL Preview</h4>
        <div className={styles.actions}>
          {entity && (
            <button
              type="button"
              onClick={handleCopy}
              className={styles.copyButton}
            >
              {copied ? '✓ Copied!' : 'Copy SQL'}
            </button>
          )}
          <button
            type="button"
            onClick={toggleCollapse}
            className={styles.collapseButton}
            title="Collapse SQL Preview"
          >
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {entity ? (
          <pre className={styles.codeBlock}>
            <code>{sql}</code>
          </pre>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Select a table to preview SQL</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  panel: `
    flex flex-col w-[36rem] min-w-[36rem] border-l border-gray-200 bg-white
  `,
  collapsedPanel: `
    flex items-start border-l border-gray-200 bg-gray-50
  `,
  expandButton: `
    flex flex-col items-center gap-2 px-2 py-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100
    transition-colors border-none bg-transparent cursor-pointer
  `,
  icon: `
    h-5 w-5 shrink-0
  `,
  verticalText: `
    writing-mode-vertical-rl text-xs font-medium tracking-wider uppercase
  `,
  header: `
    flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50
  `,
  title: `
    text-sm font-semibold text-gray-900
  `,
  actions: `
    flex items-center gap-2
  `,
  copyButton: `
    px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md
    hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer
  `,
  collapseButton: `
    flex items-center justify-center h-7 w-7 text-gray-500 hover:text-gray-700
    hover:bg-gray-100 rounded transition-colors border-none bg-transparent cursor-pointer
  `,
  content: `
    flex-1 overflow-y-auto p-4
  `,
  codeBlock: `
    bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-xs font-mono
  `,
  emptyState: `
    flex items-center justify-center h-full text-gray-400
  `,
  emptyText: `
    text-sm
  `,
};
