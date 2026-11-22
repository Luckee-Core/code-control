'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentSoftwareSystemActions } from '@/store/current';
import { createSoftwareSystemThunk, updateSoftwareSystemThunk } from '@/store/thunks/software-systems';
import { SOFTWARE_SYSTEM_DETAIL_PAGE_PATH } from '@/config/routes';
import { CustomerInput } from './inputs/customer';
import { NameInput } from './inputs/name';
import { DescriptionInput } from './inputs/description';
import { TypeInput } from './inputs/type';

export const FormModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workspaceBuilder = useAppSelector((state) => state.workspaceBuilder);
  const current = useAppSelector((state) => state.currentSoftwareSystem);
  const softwareSystems = useAppSelector((state) => state.softwareSystems);
  const editingId = workspaceBuilder.editingSoftwareSystemId;
  const saved = editingId ? softwareSystems[editingId] : undefined;

  const handleClose = () => {
    dispatch(WorkspaceBuilderActions.closeSoftwareSystemModal());
    // Editing: put back the saved row so unsaved changes don't stick on the detail page.
    if (saved) dispatch(CurrentSoftwareSystemActions.setSoftwareSystem(saved));
    else if (!editingId) dispatch(CurrentSoftwareSystemActions.reset());
  };

  const handleSave = async () => {
    if (!current.name.trim() || !current.customer_id) return;
    if (editingId) {
      const result = await dispatch(updateSoftwareSystemThunk());
      if (result.status !== 200) window.alert(result.error ?? 'Failed to save');
      return;
    }
    const result = await dispatch(createSoftwareSystemThunk());
    if (result === 200) {
      router.push(SOFTWARE_SYSTEM_DETAIL_PAGE_PATH);
    }
  };

  if (!workspaceBuilder.isSoftwareSystemModalOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{editingId ? 'Edit software system' : 'Create SoftwareSystem'}</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          <CustomerInput />
          <NameInput />
          <TypeInput />
          <DescriptionInput />
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            className={styles.saveButton}
            disabled={!current.name.trim() || !current.customer_id}
          >
            {editingId ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
  `,
  modal: `
    bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-300 overflow-hidden text-gray-900
  `,
  header: `
    flex items-center justify-between px-6 py-4 border-b border-gray-300
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  closeButton: `
    text-2xl text-gray-400 hover:text-gray-600 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  content: `
    px-6 py-4 space-y-4
  `,
  footer: `
    flex justify-end gap-2 px-6 py-4 border-t border-gray-300
  `,
  cancelButton: `
    px-4 py-2 rounded border border-gray-300 text-gray-700 cursor-pointer
    hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `,
  saveButton: `
    px-4 py-2 rounded bg-blue-600 text-white font-medium cursor-pointer
    hover:bg-blue-700 transition-colors border-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
