'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentProjectActions } from '@/store/current';
import { createProjectThunk } from '@/store/thunks/projects';
import { PROJECT_DETAIL_PAGE_PATH } from '@/config/routes';
import { CustomerInput } from './inputs/customer';
import { NameInput } from './inputs/name';
import { DescriptionInput } from './inputs/description';

export const FormModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workspaceBuilder = useAppSelector((state) => state.workspaceBuilder);
  const current = useAppSelector((state) => state.currentProject);

  const handleClose = () => {
    dispatch(WorkspaceBuilderActions.closeProjectModal());
    dispatch(CurrentProjectActions.reset());
  };

  const handleSave = async () => {
    if (!current.name.trim() || !current.customer_id) return;
    const result = await dispatch(createProjectThunk());
    if (result === 200) {
      router.push(PROJECT_DETAIL_PAGE_PATH);
    }
  };

  if (!workspaceBuilder.isProjectModalOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Project</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        <CustomerInput />
        <NameInput />
        <DescriptionInput />
        <div className={styles.buttons}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            className={styles.saveButton}
            disabled={!current.name.trim() || !current.customer_id}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4
  `,
  modal: `
    bg-white rounded-lg shadow-xl max-w-md w-full p-6
  `,
  header: `
    flex items-center justify-between mb-4
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  closeButton: `
    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700
    rounded border-none bg-transparent cursor-pointer
  `,
  buttons: `
    flex justify-end gap-2 mt-4
  `,
  cancelButton: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 cursor-pointer
  `,
  saveButton: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
