'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../input-styles';

export const NoteInput = () => {
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) => state.conventionsBuilder.exampleDraft.note);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Note (optional)</label>
      <input
        type="text"
        value={note}
        onChange={(event) => dispatch(ConventionsBuilderActions.updateExampleDraft({ note: event.target.value }))}
        placeholder="What to notice in this example"
        className={inputStyles.input}
      />
    </div>
  );
};
