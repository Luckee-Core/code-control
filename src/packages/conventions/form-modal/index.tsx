'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionBuilderActions } from '@/store/builders';
import { createConventionThunk } from '@/store/thunks/conventions';
import { CONVENTION_DETAIL_PAGE_PATH } from '@/config/routes';
import { formFieldStyles } from '@/components/form-field-styles';
import { IdentityInputs } from './inputs/identity';
import { TextInputs } from './inputs/text';
import { FlagInputs } from './inputs/flags';

export const FormModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.conventionBuilder);
  const form = builder.createForm;
  const canSave = Boolean(
    form.key.trim() && form.domain_key && form.topic_key && form.title.trim() && form.statement.trim()
  );

  const handleClose = () => dispatch(ConventionBuilderActions.closeCreateModal());

  const handleSave = async () => {
    if (!canSave) return;
    const result = await dispatch(createConventionThunk());
    if (result === 200) router.push(CONVENTION_DETAIL_PAGE_PATH);
  };

  if (!builder.isCreateModalOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>New convention</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          <IdentityInputs />
          <TextInputs />
          <FlagInputs />
          {builder.error ? <p className={formFieldStyles.error}>{builder.error}</p> : null}
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            className={styles.saveButton}
            disabled={!canSave || builder.isSaving}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`,
  modal: `bg-white rounded-lg shadow-xl max-w-xl w-full border border-gray-300 overflow-hidden text-gray-900`,
  header: `flex items-center justify-between px-6 py-4 border-b border-gray-300`,
  title: `text-xl font-semibold text-gray-900`,
  closeButton: `text-2xl text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer`,
  content: `px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto`,
  footer: `flex justify-end gap-2 px-6 py-4 border-t border-gray-300`,
  cancelButton: `
    px-4 py-2 rounded border border-gray-300 text-gray-700 cursor-pointer
    hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `,
  saveButton: `
    px-4 py-2 rounded bg-blue-600 text-white font-medium cursor-pointer
    hover:bg-blue-700 transition-colors border-none disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
