'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../input-styles';

export const CodeInput = () => {
  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.conventionsBuilder.exampleDraft.code);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Code *</label>
      <textarea
        value={code}
        onChange={(event) => dispatch(ConventionsBuilderActions.updateExampleDraft({ code: event.target.value }))}
        spellCheck={false}
        className={`${inputStyles.textarea} ${inputStyles.code}`}
      />
    </div>
  );
};
