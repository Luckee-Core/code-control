import { useAppSelector, useAppDispatch } from '@/store';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';
import type { BuildStep } from '@/model';

export const DescriptionInput = () => {
  const dispatch = useAppDispatch();
  const step = useAppSelector((state) => state.currentBuildStep) as BuildStep | null;
  const description = step?.description;

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>Description</label>
      <textarea
        value={description || ''}
        onChange={(e) =>
          dispatch(
            CurrentBuildStepActions.updateCurrentBuildStepField({
              field: 'description',
              value: e.target.value,
            })
          )
        }
        placeholder="Brief description of this build step"
        rows={3}
        className={styles.textarea}
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
  textarea: `
    w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500
    resize-none
  `,
};
