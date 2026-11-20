'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { fieldStyles } from '../../field-styles';

/** Why this edit is being made; stored with the change in the convention history. */
export const ChangeReasonInput = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.conventionsBuilder.changeReason);
  const isEditing = useAppSelector((state) => Boolean(state.currentConvention.id));
  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>{isEditing ? 'Why this change?' : 'Why add it?'} (history)</label>
      <textarea
        value={value}
        onChange={(event) => dispatch(ConventionsBuilderActions.setChangeReason(event.target.value))}
        placeholder="Recorded in the convention history; templates are updated from this change."
        className={fieldStyles.textarea}
      />
    </div>
  );
};
