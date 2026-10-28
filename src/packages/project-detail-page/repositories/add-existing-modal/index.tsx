'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { linkExistingRepoThunk } from '@/store/thunks/project-repos';
import { RepoTypeInput } from './inputs/repo-type';
import { RepoUrlInput } from './inputs/repo-url';

const modalStyles = {
  overlay: `
    fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
  `,
  modal: `
    bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto
    border border-gray-300 text-gray-900 mx-4
  `,
  header: `
    flex items-center justify-between px-6 py-4 border-b border-gray-300
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  closeButton: `
    text-2xl text-gray-400 hover:text-gray-600 transition-colors
    border-none bg-transparent cursor-pointer disabled:opacity-50
  `,
  content: `
    px-6 py-4 space-y-4
  `,
  errorText: `
    text-sm text-red-600
  `,
  footer: `
    flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-300 bg-gray-50
  `,
  cancelButton: `
    px-4 py-2 text-gray-700 border border-gray-300 rounded
    font-medium hover:bg-gray-100 transition-colors bg-white cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  saveButton: `
    px-4 py-2 bg-blue-600 text-white rounded font-medium border-none
    hover:bg-blue-700 transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};

export const AddExistingModal = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);
  const isSubmitting = repositoriesBuilder.saveStatus === 'saving';
  const canSubmit = repositoriesBuilder.existingRepoUrl.trim().length > 0 && !isSubmitting;

  if (!repositoriesBuilder.isAddExistingOpen) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) return;
    dispatch(RepositoriesBuilderActions.closeAddExisting());
  };

  return (
    <div className={modalStyles.overlay} onClick={handleClose}>
      <div className={modalStyles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>Add existing repository</h2>
          <button type="button" onClick={handleClose} className={modalStyles.closeButton}>
            ×
          </button>
        </div>
        <div className={modalStyles.content}>
          <RepoTypeInput />
          <RepoUrlInput />
          {repositoriesBuilder.linkError && (
            <p className={modalStyles.errorText}>{repositoriesBuilder.linkError}</p>
          )}
        </div>
        <div className={modalStyles.footer}>
          <button
            type="button"
            onClick={handleClose}
            className={modalStyles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void dispatch(linkExistingRepoThunk())}
            className={modalStyles.saveButton}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Adding…' : 'Add repository'}
          </button>
        </div>
      </div>
    </div>
  );
};
