'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentSoftwareSystemActions } from '@/store/current';

export const NameInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentSoftwareSystem);

  return (
    <div className={styles.field}>
      <label className={styles.label}>Name *</label>
      <input
        type="text"
        value={current.name}
        onChange={(event) =>
          dispatch(CurrentSoftwareSystemActions.updateSoftwareSystemFields({ name: event.target.value }))
        }
        placeholder="SoftwareSystem name"
        className={styles.input}
      />
    </div>
  );
};

const styles = {
  field: `
    mb-4
  `,
  label: `
    block text-sm font-medium text-gray-700 mb-1
  `,
  input: `
    w-full px-3 py-2 border border-gray-300 rounded text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
};
