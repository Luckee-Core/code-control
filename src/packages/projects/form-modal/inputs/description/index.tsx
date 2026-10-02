'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentProjectActions } from '@/store/current';

export const DescriptionInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentProject);

  return (
    <div className={styles.field}>
      <label className={styles.label}>Description</label>
      <textarea
        value={current.description ?? ''}
        onChange={(event) =>
          dispatch(
            CurrentProjectActions.updateProjectFields({
              description: event.target.value || null,
            })
          )
        }
        placeholder="Optional description"
        className={styles.textarea}
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
  textarea: `
    w-full px-3 py-2 border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500
    min-h-[80px]
  `,
};
