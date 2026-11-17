'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

export const StatementInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Statement *</label>
      <textarea
        value={current.statement}
        onChange={(event) => dispatch(CurrentConventionActions.updateFields({ statement: event.target.value }))}
        placeholder="The rule, written so an AI can follow it."
        className={fieldStyles.textarea}
      />
    </div>
  );
};
