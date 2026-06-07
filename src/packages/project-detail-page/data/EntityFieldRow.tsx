'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { deleteDataEntityFieldThunk } from '@/store/thunks/data-entity-fields';
import type { DataEntityField } from '@/model/data-entity';

type EntityFieldRowProps = {
  entityId: string;
  field: DataEntityField;
};

const getReferencedEntityName = (
  field: DataEntityField,
  entities: { id: string; name: string }[]
): string | null => {
  if (!field.references_entity_id) return null;
  const ref = entities.find((e) => e.id === field.references_entity_id);
  return ref?.name ?? null;
};

const styles = {
  row: `
    border-t border-gray-200 group
  `,
  tdName: `
    px-3 py-2 font-mono text-xs text-gray-900
  `,
  td: `
    px-3 py-2 text-xs text-gray-500
  `,
  tdCenter: `
    px-3 py-2 text-center text-xs text-gray-500
  `,
  tdAction: `
    px-3 py-2
  `,
  deleteButton: `
    opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-600 transition-all
  `,
  deleteIcon: `
    h-3.5 w-3.5
  `,
};

export const EntityFieldRow = ({ entityId, field }: EntityFieldRowProps) => {
  const dispatch = useAppDispatch();
  const entities = useAppSelector((state) => state.dataEntities);
  const refName = getReferencedEntityName(field, entities);

  const handleRemove = () => {
    void dispatch(deleteDataEntityFieldThunk(entityId, field.id));
  };

  return (
    <tr className={styles.row}>
      <td className={styles.tdName}>{field.name}</td>
      <td className={styles.td}>{field.type}</td>
      <td className={styles.td}>{refName || '–'}</td>
      <td className={styles.tdCenter}>{field.nullable ? '✓' : '–'}</td>
      <td className={styles.td}>{field.default_value || '–'}</td>
      <td className={styles.tdAction}>
        <button
          type="button"
          onClick={handleRemove}
          className={styles.deleteButton}
        >
          <svg className={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
};
