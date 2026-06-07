'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { deleteDataEntityThunk } from '@/store/thunks/data-entities';
import { EntityFieldRow } from './EntityFieldRow';
import { AddFieldForm } from './AddFieldForm';
import type { DataEntityWithFields } from '@/model/data-entity';

type EntityGroupProps = {
  entity: DataEntityWithFields;
};

const styles = {
  groupHeader: `
    bg-gray-50 border-b-2 border-gray-300
  `,
  groupHeaderCell: `
    px-3 py-2
  `,
  expandButton: `
    mr-2 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200
    rounded transition-colors cursor-pointer font-mono text-xs border-none bg-transparent
  `,
  entityIcon: `
    mr-2 text-base
  `,
  entityName: `
    font-semibold text-gray-900 text-sm
  `,
  tableName: `
    ml-2 text-xs text-gray-500
  `,
  deleteBtn: `
    ml-auto text-red-600 hover:underline text-sm cursor-pointer
  `,
  addFieldCell: `
    px-3 py-2 border-b border-gray-100 bg-gray-50/50
  `,
  emptyRow: `
    text-sm text-gray-500 italic px-3 py-2 border-b border-gray-100
  `,
  rowInner: `
    flex items-center
  `,
};

export const EntityGroup = ({ entity }: EntityGroupProps) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const fields = entity.fields ?? [];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete entity "${entity.name}" and all its fields?`)) {
      void dispatch(deleteDataEntityThunk(entity.id));
    }
  };

  return (
    <>
      <tr className={styles.groupHeader}>
        <td colSpan={6} className={styles.groupHeaderCell}>
          <div className={styles.rowInner}>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.expandButton}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
            <span className={styles.entityIcon}>📦</span>
            <span className={styles.entityName}>{entity.name}</span>
            {entity.table_name && (
              <span className={styles.tableName}>({entity.table_name})</span>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className={styles.deleteBtn}
              aria-label={`Delete ${entity.name}`}
            >
              Delete entity
            </button>
          </div>
        </td>
      </tr>
      {isExpanded &&
        fields.map((f) => (
          <EntityFieldRow key={f.id} entityId={entity.id} field={f} />
        ))}
      {isExpanded && fields.length === 0 && (
        <tr>
          <td colSpan={6} className={styles.emptyRow}>
            No fields yet. Add a field below.
          </td>
        </tr>
      )}
      {isExpanded && (
        <tr>
          <td colSpan={6} className={styles.addFieldCell}>
            <AddFieldForm entityId={entity.id} existingCount={fields.length} />
          </td>
        </tr>
      )}
    </>
  );
};
