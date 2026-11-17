'use client';

import type { ConventionExampleKind } from '@/model/convention-example';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../input-styles';

export const KindInput = () => {
  const dispatch = useAppDispatch();
  const kind = useAppSelector((state) => state.conventionsBuilder.exampleDraft.kind);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Kind</label>
      <select
        value={kind}
        onChange={(event) =>
          dispatch(ConventionsBuilderActions.updateExampleDraft({ kind: event.target.value as ConventionExampleKind }))
        }
        className={inputStyles.select}
      >
        <option value="correct">✅ Correct</option>
        <option value="incorrect">❌ Incorrect</option>
      </select>
    </div>
  );
};
