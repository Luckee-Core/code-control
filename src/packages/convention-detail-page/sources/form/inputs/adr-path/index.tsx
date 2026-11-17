'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../../../examples/form/input-styles';

export const AdrPathInput = () => {
  const dispatch = useAppDispatch();
  const adrPath = useAppSelector((state) => state.conventionsBuilder.sourceDraft.adr_path);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Path (relative to ~/github) *</label>
      <input
        type="text"
        value={adrPath}
        onChange={(event) => dispatch(ConventionsBuilderActions.updateSourceDraft({ adr_path: event.target.value }))}
        placeholder="templates/express-server-template/.cursor/architecture/010-no-sql-functions.md"
        className={`${inputStyles.input} font-mono`}
      />
    </div>
  );
};
