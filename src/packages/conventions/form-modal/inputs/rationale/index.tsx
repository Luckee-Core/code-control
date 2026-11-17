'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

export const RationaleInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Why</label>
      <textarea
        value={current.rationale}
        onChange={(event) => dispatch(CurrentConventionActions.updateFields({ rationale: event.target.value }))}
        placeholder="Why Luckee does it this way."
        className={fieldStyles.textarea}
      />
    </div>
  );
};
