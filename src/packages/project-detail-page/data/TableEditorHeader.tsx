'use client';

import { useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import type { DataEntityWithFields } from '@/model/data-entity';
import type { ProjectRepo } from '@/api/project-setup';

type TableEditorHeaderProps = {
  entity: DataEntityWithFields;
  assignedRepos: ProjectRepo[];
  confirmDelete: boolean;
  onDeleteEntity: () => void;
};

const styles = {
  header: `
    px-5 py-3 border-b border-gray-200 bg-white flex items-center gap-3 shrink-0
  `,
  headerLeft: `
    flex-1 min-w-0
  `,
  entityName: `
    text-sm font-semibold text-gray-900
  `,
  tableNameBadge: `
    text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-2
  `,
  description: `
    text-xs text-gray-500 mt-0.5
  `,
  headerRight: `
    flex items-center gap-2
  `,
  repoBadge: `
    inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700
  `,
  buildLink: `
    inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium
    border-none bg-transparent cursor-pointer
  `,
  buildLinkIcon: `
    h-3 w-3
  `,
  deleteButton: `
    text-xs px-2 py-1 rounded transition-colors border-none cursor-pointer
  `,
  deleteButtonNormal: `
    text-gray-500 hover:text-red-600 hover:bg-red-50
  `,
  deleteButtonConfirm: `
    bg-red-600 text-white
  `,
};

export const TableEditorHeader = ({
  entity,
  assignedRepos,
  confirmDelete,
  onDeleteEntity,
}: TableEditorHeaderProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.entityName}>
          <span>{entity.name}</span>
          <span className={styles.tableNameBadge}>{entity.table_name ?? entity.name}</span>
        </div>
        {entity.description && <p className={styles.description}>{entity.description}</p>}
      </div>
      <div className={styles.headerRight}>
        {assignedRepos.length > 0 && (
          <div className="flex items-center gap-1">
            {assignedRepos.map((r) => (
              <span key={r.id} className={styles.repoBadge}>
                {r.name}
              </span>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            dispatch(WorkspaceBuilderActions.setActiveWorkspaceView('build'))
          }
          className={styles.buildLink}
        >
          Build
          <svg
            className={styles.buildLinkIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDeleteEntity}
          className={`${styles.deleteButton} ${
            confirmDelete ? styles.deleteButtonConfirm : styles.deleteButtonNormal
          }`}
        >
          {confirmDelete ? 'Confirm delete?' : 'Delete table'}
        </button>
      </div>
    </div>
  );
};
