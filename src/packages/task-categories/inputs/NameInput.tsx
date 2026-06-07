import { useAppSelector, useAppDispatch } from '@/store';
import { CurrentTaskCategoryActions } from '@/store/current/currentTaskCategory';

export const NameInput = () => {
  const dispatch = useAppDispatch();
  const name = (useAppSelector((state) => state.currentTaskCategory) as import('@/model').TaskCategory | null)?.name;

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>Name *</label>
      <input
        type="text"
        value={name || ''}
        onChange={(e) =>
          dispatch(
            CurrentTaskCategoryActions.updateCurrentTaskCategoryField({
              field: 'name',
              value: e.target.value,
            })
          )
        }
        placeholder="e.g., api, express, redux"
        className={styles.input}
      />
    </div>
  );
};

const styles = {
  formGroup: `
    space-y-2
  `,
  label: `
    block text-sm font-medium text-gray-700
  `,
  input: `
    w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
};
