'use client';

import type { DataEntityField, DataEntityWithFields } from '@/model/data-entity';

type FieldRowProps = {
  field: DataEntityField;
  index: number;
  entities: DataEntityWithFields[];
  onDelete: (fieldId: string) => void;
};

const styles = {
  tr: `
    border-b border-gray-200 hover:bg-gray-50/50 transition-colors group
  `,
  td: `
    px-4 py-2.5
  `,
  tdNum: `
    text-xs text-gray-500 tabular-nums
  `,
  fieldName: `
    flex items-center gap-1.5
  `,
  keyIcon: `
    h-3 w-3 text-blue-600
  `,
  fieldMono: `
    font-mono text-xs text-gray-900
  `,
  typeBadge: `
    inline-flex px-1.5 py-0.5 rounded text-[11px] font-mono bg-gray-100 text-gray-600
  `,
  defaultMono: `
    font-mono text-xs text-gray-500
  `,
  defaultEmpty: `
    text-gray-300
  `,
  nullableText: `
    text-xs
  `,
  fkLink: `
    inline-flex items-center gap-1 text-xs text-blue-600
  `,
  fkIcon: `
    h-3 w-3
  `,
  deleteFieldBtn: `
    opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all
    border-none bg-transparent cursor-pointer p-0
  `,
  tdDelete: `
    px-2 py-2.5 text-center
  `,
};

export const FieldRow = ({ field, index, entities, onDelete }: FieldRowProps) => {
  const refEntity = field.references_entity_id
    ? entities.find((e) => e.id === field.references_entity_id)
    : null;
  const isPK = field.name === 'id';

  return (
    <tr className={styles.tr}>
      <td className={`${styles.td} ${styles.tdNum}`}>{index + 1}</td>
      <td className={styles.td}>
        <div className={styles.fieldName}>
          {isPK && (
            <svg
              className={styles.keyIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          )}
          <span className={styles.fieldMono}>{field.name}</span>
        </div>
      </td>
      <td className={styles.td}>
        <span className={styles.typeBadge}>{field.type}</span>
      </td>
      <td className={styles.td}>
        <span
          className={`${styles.defaultMono} ${!field.default_value ? styles.defaultEmpty : ''}`}
        >
          {field.default_value ?? '–'}
        </span>
      </td>
      <td className={`${styles.td} text-center ${styles.nullableText}`}>
        {field.nullable ? (
          <span className="text-gray-500">NULL</span>
        ) : (
          <span className="text-gray-900 font-medium">NOT NULL</span>
        )}
      </td>
      <td className={styles.td}>
        {refEntity ? (
          <span className={styles.fkLink}>
            <svg
              className={styles.fkIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {refEntity.table_name ?? refEntity.name}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">–</span>
        )}
      </td>
      <td className={styles.tdDelete}>
        <button
          type="button"
          onClick={() => onDelete(field.id)}
          className={styles.deleteFieldBtn}
          title="Delete field"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};
