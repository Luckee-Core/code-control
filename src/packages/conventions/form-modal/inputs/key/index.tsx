'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

export const KeyInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Key *</label>
      <input
        type="text"
        value={current.key}
        disabled={Boolean(current.id)}
        onChange={(event) => dispatch(CurrentConventionActions.updateFields({ key: event.target.value.toLowerCase() }))}
        placeholder="dm.table.snake_plural"
        className={`${fieldStyles.input} ${fieldStyles.mono}`}
      />
      <span className={fieldStyles.hint}>Stable dotted id. Cannot change after create.</span>
    </div>
  );
};
