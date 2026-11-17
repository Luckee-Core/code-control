'use client';

import { useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { createConventionSourceThunk } from '@/store/thunks/conventions';
import { AdrPathInput } from './inputs/adr-path';
import { ExcerptInput } from './inputs/excerpt';
import { RepoInput } from './inputs/repo';

export const SourceForm = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.conventionsBuilder.sourceDraft);
  const [error, setError] = useState<string | null>(null);

  const canSave = Boolean(draft.repo.trim() && draft.adr_path.trim());

  const handleSave = async () => {
    const status = await dispatch(createConventionSourceThunk());
    setError(status === 200 ? null : 'Could not save the source.');
  };

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <RepoInput />
        <AdrPathInput />
      </div>
      <ExcerptInput />
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.footer}>
        <button
          type="button"
          onClick={() => dispatch(ConventionsBuilderActions.closeSourceForm())}
          className={detailPageStyles.secondaryButton}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={!canSave}
          className={detailPageStyles.primaryButton}
        >
          Save source
        </button>
      </div>
    </div>
  );
};

const styles = {
  form: `flex flex-col gap-3 border border-gray-200 rounded p-3 bg-gray-50`,
  row: `grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3`,
  error: `text-xs text-red-700`,
  footer: `flex justify-end gap-2`,
};
