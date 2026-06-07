import { useAppSelector, useAppDispatch } from '@/store';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';

export const IsActiveInput = () => {
  const dispatch = useAppDispatch();
  const isActive = (useAppSelector((state) => state.currentBuildStep) as import('@/model').BuildStep | null)?.is_active;

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={isActive !== undefined ? isActive : true}
          onChange={(e) =>
            dispatch(
              CurrentBuildStepActions.updateCurrentBuildStepField({
                field: 'is_active',
                value: e.target.checked,
              })
            )
          }
          className={styles.checkbox}
        />
        <span className={styles.labelText}>Active</span>
      </label>
    </div>
  );
};

const styles = {
  formGroup: `
    space-y-2
  `,
  label: `
    flex items-center gap-2
    cursor-pointer
  `,
  checkbox: `
    w-4 h-4 rounded border-gray-300
    focus:ring-2 focus:ring-blue-500
  `,
  labelText: `
    text-sm font-medium text-gray-700
  `,
};
