'use client';

import { EntityFieldRow } from './EntityFieldRow';
import type { DataEntityField } from '@/model/data-entity';

type FieldsTableProps = {
  entityId: string;
  fields: DataEntityField[];
};

const styles = {
  table: `
    w-full border-collapse
  `,
  thead: `
    bg-gray-50 border-b border-gray-200
  `,
  th: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase
  `,
  tbody: `
  `,
};

export const FieldsTable = ({ entityId, fields }: FieldsTableProps) => {
  if (fields.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        No fields yet. Add your first field below.
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>Name</th>
          <th className={styles.th}>Type</th>
          <th className={styles.th}>Nullable</th>
          <th className={styles.th}>Default</th>
          <th className={styles.th}></th>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {fields.map((field) => (
          <EntityFieldRow key={field.id} field={field} entityId={entityId} />
        ))}
      </tbody>
    </table>
  );
};
