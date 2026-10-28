'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { createWebRepoThunk } from '@/store/thunks/project-repos';
import { NameInput } from './inputs/name';
import { RuntimeInput } from './inputs/runtime';

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

export const WebModal = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);
  const isSubmitting = repositoriesBuilder.saveStatus === 'saving';
  const canSubmit = repositoriesBuilder.webRepoName.trim().length > 0 && !isSubmitting;
  const isReactNative = repositoriesBuilder.frontendRuntime === 'react-native';
  const title = isReactNative ? 'Create React Native repo' : 'Create web repo';
  const submitLabel = isReactNative ? 'Create React Native Repo' : 'Create Web Repo';

  if (!repositoriesBuilder.isWebCreateOpen) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) return;
    dispatch(RepositoriesBuilderActions.closeWebCreate());
  };

  return (
    <div className={modalStyles.overlay} onClick={handleClose}>
      <div className={modalStyles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>{title}</h2>
          <button type="button" onClick={handleClose} className={modalStyles.closeButton}>
            ×
          </button>
        </div>
        <div className={modalStyles.content}>
          <RuntimeInput />
          <NameInput />
          {repositoriesBuilder.saveStatus === 'error' && repositoriesBuilder.linkError && (
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
            onClick={() => void dispatch(createWebRepoThunk())}
            className={modalStyles.saveButton}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Creating…' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
