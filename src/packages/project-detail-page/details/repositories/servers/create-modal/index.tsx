'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { createExpressRepo } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { getSelectedGithubOwner } from '@/config/github-orgs';

const TITLE = 'Create Express repo';
const PLACEHOLDER = 'e.g. roads-crm-express-server';
const SUBMIT_LABEL = 'Create Express Repo';
const NAME_LABEL = 'Repository name';
const FAILED_MESSAGE = 'Failed';

type Props = { isOpen: boolean; onClose: () => void; onCreated: () => void };

const slugify = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export const CreateExpressRepoModal = ({ isOpen, onClose, onCreated }: Props) => {
  const currentProject = useAppSelector((state) => state.currentProject);
  const slug = currentProject?.name ? slugify(currentProject.name) : '';
  const defaultName = slug ? `${slug}-express-server` : '';
  const [nameValue, setNameValue] = useState(defaultName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNameValue(defaultName);
      setIsSubmitting(false);
      setErrorMessage(null);
    }
  }, [isOpen, defaultName]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    onClose();
  };

  const handleSubmit = async () => {
    const name = nameValue.trim();
    if (!currentProject?.id || !name || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    const owner = getSelectedGithubOwner();
    const response = await createExpressRepo(currentProject.id, getApiBaseUrl(), {
      name,
      ...(owner ? { owner } : {}),
    });
    setIsSubmitting(false);

    if (response.success) {
      onCreated();
      onClose();
      return;
    }

    setErrorMessage(response.error || FAILED_MESSAGE);
  };

  const canSubmit = nameValue.trim().length > 0 && !isSubmitting;

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
          <div className={styles.field}>
            <label htmlFor="create-express-repo-name" className={styles.label}>
              {NAME_LABEL}
            </label>
            <input
              id="create-express-repo-name"
              type="text"
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleSubmit();
                }
              }}
              placeholder={PLACEHOLDER}
              className={styles.input}
              autoFocus
            />
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
            onClick={() => {
              void handleSubmit();
            }}
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
  field: `
    flex flex-col gap-2
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  input: `
    w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
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
