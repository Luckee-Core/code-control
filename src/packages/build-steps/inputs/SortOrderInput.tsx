import { useAppSelector, useAppDispatch } from '@/store';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';

export const SortOrderInput = () => {
  const dispatch = useAppDispatch();
  const sortOrder = (useAppSelector((state) => state.currentBuildStep) as import('@/model').BuildStep | null)?.sort_order;

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>Sort Order</label>
      <input
        type="number"
        value={sortOrder !== undefined ? sortOrder : 0}
        onChange={(e) =>
          dispatch(
            CurrentBuildStepActions.updateCurrentBuildStepField({
              field: 'sort_order',
              value: parseInt(e.target.value) || 0,
            })
          )
        }
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
