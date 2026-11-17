'use client';

import { useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { createConventionExampleThunk } from '@/store/thunks/conventions';
import { CodeInput } from './inputs/code';
import { KindInput } from './inputs/kind';
import { LanguageInput } from './inputs/language';
import { NoteInput } from './inputs/note';
import { PathHintInput } from './inputs/path-hint';
import { TitleInput } from './inputs/title';

export const ExampleForm = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.conventionsBuilder.exampleDraft);
  const [error, setError] = useState<string | null>(null);

  const canSave = Boolean(draft.title.trim() && draft.code.trim());

  const handleSave = async () => {
    const status = await dispatch(createConventionExampleThunk());
    setError(status === 200 ? null : 'Could not save the example.');
  };

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <TitleInput />
        <KindInput />
        <LanguageInput />
      </div>
      <PathHintInput />
      <CodeInput />
      <NoteInput />
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.footer}>
        <button
          type="button"
          onClick={() => dispatch(ConventionsBuilderActions.closeExampleForm())}
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
          Save example
        </button>
      </div>
    </div>
  );
};

const styles = {
  form: `flex flex-col gap-3 border border-gray-200 rounded p-3 bg-gray-50`,
  row: `grid grid-cols-1 md:grid-cols-[1fr_140px_120px] gap-3`,
  error: `text-xs text-red-700`,
  footer: `flex justify-end gap-2`,
};
