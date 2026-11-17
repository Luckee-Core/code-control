'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../../../examples/form/input-styles';

export const RepoInput = () => {
  const dispatch = useAppDispatch();
  const repo = useAppSelector((state) => state.conventionsBuilder.sourceDraft.repo);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Repo *</label>
      <input
        type="text"
        value={repo}
        onChange={(event) => dispatch(ConventionsBuilderActions.updateSourceDraft({ repo: event.target.value }))}
        placeholder="express-server-template"
        className={inputStyles.input}
      />
    </div>
  );
};
