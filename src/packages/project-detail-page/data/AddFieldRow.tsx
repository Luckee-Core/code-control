'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { createDataEntityFieldThunk } from '@/store/thunks/data-entity-fields';
import type { DataEntityWithFields } from '@/model/data-entity';

type AddFieldRowProps = {
  entityId: string;
  entities: DataEntityWithFields[];
  fieldCount: number;
  onFieldAdded: () => void;
};

const FIELD_TYPES = [
  'uuid',
  'text',
  'varchar',
  'integer',
  'bigint',
  'boolean',
  'timestamp',
  'date',
  'jsonb',
  'numeric',
];

const styles = {
  tr: `
    border-b border-gray-200 bg-gray-50/30
  `,
  td: `
    px-4 py-2.5
  `,
  tdIcon: `
    text-gray-400
  `,
  plusIcon: `
    h-4 w-4
  `,
  input: `
    w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  select: `
    w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white
  `,
  checkbox: `
    h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500
  `,
  addBtn: `
    text-blue-600 hover:text-blue-700 transition-colors border-none bg-transparent cursor-pointer p-0
  `,
  addBtnIcon: `
    h-4 w-4
  `,
};

export const AddFieldRow = ({
  entityId,
  entities,
  fieldCount,
  onFieldAdded,
}: AddFieldRowProps) => {
  const dispatch = useAppDispatch();
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [fieldNullable, setFieldNullable] = useState(true);
  const [fieldDefault, setFieldDefault] = useState('');
  const [fieldRef, setFieldRef] = useState('');

  const handleAddField = async () => {
    if (!fieldName.trim()) return;

    await dispatch(
      createDataEntityFieldThunk({
        entity_id: entityId,
        name: fieldName.trim(),
        type: fieldType,
        nullable: fieldNullable,
        default_value: fieldDefault.trim() || null,
        references_entity_id: fieldRef || null,
      })
    );

    setFieldName('');
    setFieldType('text');
    setFieldNullable(true);
    setFieldDefault('');
    setFieldRef('');
    onFieldAdded();
  };

  return (
    <tr className={styles.tr}>
      <td className={`${styles.td} ${styles.tdIcon}`}>
        <svg
          className={styles.plusIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </td>
      <td className={styles.td}>
        <input
          type="text"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="field_name"
          className={styles.input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddField();
          }}
        />
      </td>
      <td className={styles.td}>
        <select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
          className={styles.select}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.td}>
        <input
          type="text"
          value={fieldDefault}
          onChange={(e) => setFieldDefault(e.target.value)}
          placeholder="default"
          className={styles.input}
        />
      </td>
      <td className={`${styles.td} text-center`}>
        <input
          type="checkbox"
          checked={fieldNullable}
          onChange={(e) => setFieldNullable(e.target.checked)}
          className={styles.checkbox}
        />
      </td>
      <td className={styles.td}>
        <select
          value={fieldRef}
          onChange={(e) => setFieldRef(e.target.value)}
          className={styles.select}
        >
          <option value="">–</option>
          {entities
            .filter((e) => e.id !== entityId)
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.table_name ?? e.name}
              </option>
            ))}
        </select>
      </td>
      <td className={styles.td}>
        <button
          type="button"
          onClick={handleAddField}
          className={styles.addBtn}
          title="Add field"
        >
          <svg
            className={styles.addBtnIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};
