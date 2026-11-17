'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../input-styles';

export const TitleInput = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.conventionsBuilder.exampleDraft.title);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Title *</label>
      <input
        type="text"
        value={title}
        onChange={(event) => dispatch(ConventionsBuilderActions.updateExampleDraft({ title: event.target.value }))}
        placeholder="Golden entity table"
        className={inputStyles.input}
      />
    </div>
  );
};
