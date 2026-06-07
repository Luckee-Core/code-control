'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { deleteDataEntityThunk } from '@/store/thunks/data-entities';
import { AddFieldForm } from './AddFieldForm';
import { FieldsTable } from './FieldsTable';
import type { DataEntityWithFields } from '@/model/data-entity';

type EntityAccordionProps = {
  entity: DataEntityWithFields;
};

const styles = {
  accordion: `
    border border-gray-200 rounded overflow-hidden mb-3
  `,
  header: `
    flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100
  `,
  headerLeft: `
    flex items-center gap-2
  `,
  chevron: `
    text-gray-500 text-sm
  `,
  name: `
    font-medium text-gray-900
  `,
  tableName: `
    text-sm text-gray-500
  `,
  deleteBtn: `
    text-red-600 hover:underline text-sm
  `,
  body: `
    p-4 border-t border-gray-200
  `,
};

export const EntityAccordion = ({ entity }: EntityAccordionProps) => {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const fields = entity.fields ?? [];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete entity "${entity.name}" and all its fields?`)) {
      void dispatch(deleteDataEntityThunk(entity.id));
    }
  };

  return (
    <div className={styles.accordion}>
      <div
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
        role="button"
        tabIndex={0}
      >
        <div className={styles.headerLeft}>
          <span className={styles.chevron}>{expanded ? '▼' : '▶'}</span>
          <span className={styles.name}>{entity.name}</span>
          {entity.table_name && (
            <span className={styles.tableName}>({entity.table_name})</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteBtn}
          aria-label={`Delete ${entity.name}`}
        >
          Delete entity
        </button>
      </div>
      {expanded && (
        <div className={styles.body}>
          <FieldsTable entityId={entity.id} fields={fields} />
          <AddFieldForm entityId={entity.id} existingCount={fields.length} />
        </div>
      )}
    </div>
  );
};
