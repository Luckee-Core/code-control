'use client';

import { useState, useEffect } from 'react';
import type { RepoType } from '@/api/project-setup';

type RepoTypeOption = Extract<RepoType, 'express' | 'nextjs'>;

type AddExistingRepoModalProps = {
  isOpen: boolean;
  hasExpressRepo: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (repoType: RepoTypeOption, repoUrl: string) => void;
};

export const AddExistingRepoModal = ({
  isOpen,
  hasExpressRepo,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: AddExistingRepoModalProps) => {
  const [repoType, setRepoType] = useState<RepoTypeOption>('nextjs');
  const [repoUrl, setRepoUrl] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setRepoType('nextjs');
      setRepoUrl('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setRepoType('nextjs');
    setRepoUrl('');
    onClose();
  };

  const handleSubmit = () => {
    const trimmedUrl = repoUrl.trim();
    if (!trimmedUrl || isSubmitting) {
      return;
    }
    onSubmit(repoType, trimmedUrl);
  };

  const canSubmit = repoUrl.trim().length > 0 && !isSubmitting;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add existing repository</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <fieldset className={styles.field}>
            <legend className={styles.label}>Repository type</legend>
            <div className={styles.typeOptions}>
              <label className={styles.typeOption}>
                <input
                  type="radio"
                  name="existing-repo-type"
                  value="express"
                  checked={repoType === 'express'}
                  disabled={hasExpressRepo}
                  onChange={() => setRepoType('express')}
                  className={styles.typeRadio}
                />
                <span className={styles.typeOptionText}>Express server</span>
              </label>
              <label className={styles.typeOption}>
                <input
                  type="radio"
                  name="existing-repo-type"
                  value="nextjs"
                  checked={repoType === 'nextjs'}
                  onChange={() => setRepoType('nextjs')}
                  className={styles.typeRadio}
                />
                <span className={styles.typeOptionText}>Next.js web app</span>
              </label>
            </div>
            {hasExpressRepo && (
              <p className={styles.hint}>This project already has an express server linked.</p>
            )}
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="existing-repo-url" className={styles.label}>
              Repository URL
            </label>
            <input
              id="existing-repo-url"
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
              placeholder="https://github.com/owner/repo"
              className={styles.input}
              autoFocus
            />
            <p className={styles.hint}>Paste a GitHub HTTPS or SSH clone URL.</p>
          </div>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
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
            onClick={handleSubmit}
            className={styles.saveButton}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Adding…' : 'Add repository'}
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
  field: `
    flex flex-col gap-2 border-0 p-0 m-0
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  typeOptions: `
    flex flex-col gap-2
  `,
  typeOption: `
    inline-flex items-center gap-2 cursor-pointer
  `,
  typeRadio: `
    h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500
  `,
  typeOptionText: `
    text-sm text-gray-900
  `,
  input: `
    w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  hint: `
    text-xs text-gray-500
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
