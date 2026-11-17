'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { saveConventionThunk } from '@/store/thunks/conventions';
import { CheckConfigInput } from './inputs/check-config';
import { CheckKindInput } from './inputs/check-kind';
import { KeyInput } from './inputs/key';
import { RationaleInput } from './inputs/rationale';
import { RolesInput } from './inputs/roles';
import { SeverityInput } from './inputs/severity';
import { StatementInput } from './inputs/statement';
import { StatusInput } from './inputs/status';
import { TitleInput } from './inputs/title';
import { TopicInput } from './inputs/topic';

export const FormModal = () => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.conventionsBuilder);
  const current = useAppSelector((state) => state.currentConvention);

  if (!builder.isFormModalOpen) return null;

  const isEditing = Boolean(current.id);
  const canSave =
    Boolean(current.title.trim() && current.statement.trim() && current.topic_key) &&
    (isEditing || Boolean(current.key.trim())) &&
    builder.saveStatus !== 'saving';

  const handleClose = () => dispatch(ConventionsBuilderActions.closeFormModal());

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEditing ? 'Edit convention' : 'New convention'}</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.content}>
          <KeyInput />
          <TitleInput />
          <TopicInput />
          <div className={styles.row}>
            <SeverityInput />
            <StatusInput />
          </div>
          <StatementInput />
          <RationaleInput />
          <RolesInput />
          <CheckKindInput />
          <CheckConfigInput />
          {builder.saveError ? <p className={styles.error}>{builder.saveError}</p> : null}
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void dispatch(saveConventionThunk())}
            className={styles.saveButton}
            disabled={!canSave}
          >
            {builder.saveStatus === 'saving' ? 'Saving…' : isEditing ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`,
  modal: `
    bg-white rounded-lg shadow-xl max-w-xl w-full border border-gray-300 overflow-hidden text-gray-900
    max-h-[90vh] flex flex-col
  `,
  header: `flex items-center justify-between px-6 py-4 border-b border-gray-300`,
  title: `text-lg font-semibold text-gray-900`,
  closeButton: `text-2xl text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer`,
  content: `px-6 py-4 space-y-4 overflow-y-auto`,
  row: `grid grid-cols-2 gap-3`,
  error: `text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
  footer: `flex justify-end gap-2 px-6 py-4 border-t border-gray-300`,
  cancelButton: `
    px-4 py-2 rounded border border-gray-300 text-gray-700 cursor-pointer
    hover:bg-gray-50 transition-colors
  `,
  saveButton: `
    px-4 py-2 rounded bg-blue-600 text-white font-medium cursor-pointer
    hover:bg-blue-700 transition-colors border-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
