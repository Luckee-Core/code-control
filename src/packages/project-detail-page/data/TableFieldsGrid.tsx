'use client';

import { FieldRow } from './FieldRow';
import { AddFieldRow } from './AddFieldRow';
import type { DataEntityWithFields } from '@/model/data-entity';

type TableFieldsGridProps = {
  entity: DataEntityWithFields;
  entities: DataEntityWithFields[];
  onDeleteField: (fieldId: string) => void;
};

const styles = {
  tableWrap: `
    flex-1 overflow-auto min-h-0
  `,
  table: `
    w-full border-collapse
  `,
  thead: `
    sticky top-0 z-10 bg-gray-50 border-b border-gray-200
  `,
  th: `
    px-4 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider
  `,
  thNum: `
    w-12
  `,
  thName: `
    w-[20%]
  `,
  thType: `
    w-[15%]
  `,
  thDefault: `
    w-[15%]
  `,
  thNullable: `
    w-[12%] text-center
  `,
  thFk: `
    w-[18%]
  `,
  thActions: `
    w-16
  `,
  emptyState: `
    px-4 py-12 text-center
  `,
  emptyIcon: `
    h-8 w-8 mx-auto text-gray-300 mb-2
  `,
  emptyText: `
    text-sm text-gray-500
  `,
};

export const TableFieldsGrid = ({ entity, entities, onDeleteField }: TableFieldsGridProps) => {
  const fields = entity.fields ?? [];

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${styles.th} ${styles.thNum}`}>#</th>
            <th className={`${styles.th} ${styles.thName}`}>Column</th>
            <th className={`${styles.th} ${styles.thType}`}>Type</th>
            <th className={`${styles.th} ${styles.thDefault}`}>Default</th>
            <th className={`${styles.th} ${styles.thNullable}`}>Nullable</th>
            <th className={`${styles.th} ${styles.thFk}`}>Foreign Key</th>
            <th className={`${styles.th} ${styles.thActions}`}></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, idx) => (
            <FieldRow
              key={field.id}
              field={field}
              index={idx}
              entities={entities}
              onDelete={onDeleteField}
            />
          ))}
          <AddFieldRow
            entityId={entity.id}
            entities={entities}
            fieldCount={fields.length}
            onFieldAdded={() => {}}
          />
        </tbody>
      </table>
      {fields.length === 0 && (
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className={styles.emptyText}>No columns yet. Add your first column below.</p>
        </div>
      )}
    </div>
  );
};
