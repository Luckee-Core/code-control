'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { createExpressRepoThunk } from '@/store/thunks/project-repos';
import { NameInput } from './inputs/name';

const TITLE = 'Create Express repo';
const SUBMIT_LABEL = 'Create Express Repo';

export const ExpressModal = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);
  const isSubmitting = repositoriesBuilder.saveStatus === 'saving';
  const canSubmit = repositoriesBuilder.expressRepoName.trim().length > 0 && !isSubmitting;

  if (!repositoriesBuilder.isExpressCreateOpen) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) return;
    dispatch(RepositoriesBuilderActions.closeExpressCreate());
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{TITLE}</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <NameInput />
          {repositoriesBuilder.saveStatus === 'error' && repositoriesBuilder.linkError && (
            <p className={styles.errorText}>{repositoriesBuilder.linkError}</p>
          )}
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleClose}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void dispatch(createExpressRepoThunk())}
            className={styles.saveButton}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Creating…' : SUBMIT_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 bg-black bg-opacity-50 z-50
    flex items-center justify-center
  `,
  modal: `
    bg-white rounded-lg shadow-xl
    w-full max-w-lg max-h-[90vh] overflow-auto
    mx-4
  `,
  header: `
    flex items-center justify-between
    px-6 py-4 border-b border-gray-200
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  closeButton: `
    text-gray-400 hover:text-gray-600
    text-2xl leading-none
    transition-colors border-none bg-transparent cursor-pointer
  `,
  content: `
    px-6 py-4 space-y-4
  `,
  errorText: `
    text-sm text-red-600
  `,
  footer: `
    flex items-center justify-end gap-3
    px-6 py-4 border-t border-gray-200
    bg-gray-50
  `,
  cancelButton: `
    px-4 py-2 text-gray-700 border border-gray-300 rounded-lg
    font-medium
    hover:bg-gray-100
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors bg-white cursor-pointer
  `,
  saveButton: `
    px-4 py-2 bg-blue-600 text-white rounded-lg
    font-medium border-none
    hover:bg-blue-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors cursor-pointer
  `,
};
