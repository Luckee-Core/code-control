'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

export const TitleInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Title *</label>
      <input
        type="text"
        value={current.title}
        onChange={(event) => dispatch(CurrentConventionActions.updateFields({ title: event.target.value }))}
        placeholder="Table names are snake_case plural"
        className={fieldStyles.input}
      />
    </div>
  );
};
