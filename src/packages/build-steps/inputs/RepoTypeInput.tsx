import { useAppSelector, useAppDispatch } from '@/store';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';

export const RepoTypeInput = () => {
  const dispatch = useAppDispatch();
  const repoType = (useAppSelector((state) => state.currentBuildStep) as import('@/model').BuildStep | null)?.repo_type;

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>Repo Type *</label>
      <select
        value={repoType || ''}
        onChange={(e) =>
          dispatch(
            CurrentBuildStepActions.updateCurrentBuildStepField({
              field: 'repo_type',
              value: e.target.value,
            })
          )
        }
        className={styles.select}
      >
        <option value="">Select repo type</option>
        <option value="express">Express</option>
        <option value="nextjs">Next.js</option>
        <option value="react-native">React Native</option>
      </select>
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
  select: `
    w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
};
