'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../input-styles';

export const PathHintInput = () => {
  const dispatch = useAppDispatch();
  const pathHint = useAppSelector((state) => state.conventionsBuilder.exampleDraft.path_hint);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>File path (optional)</label>
      <input
        type="text"
        value={pathHint ?? ''}
        onChange={(event) =>
          dispatch(ConventionsBuilderActions.updateExampleDraft({ path_hint: event.target.value || null }))
        }
        placeholder="migrations/002_estimates.sql"
        className={`${inputStyles.input} font-mono`}
      />
    </div>
  );
};
