'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { CurrentProjectActions } from '@/store/current';
import { createProjectThunk } from '@/store/thunks/projects';

export const CreateProjectModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.workspaceBuilder.isProjectModalOpen);
  const current = useAppSelector((state) => state.currentProject);

  const handleClose = () => {
    dispatch(WorkspaceBuilderActions.closeProjectModal());
    dispatch(CurrentProjectActions.reset());
  };

  const handleSave = async () => {
    if (!current.name.trim() || !current.customer_id) return;
    const result = await dispatch(createProjectThunk());
    if (result === 200) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Project</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Name *</label>
          <input
            type="text"
            value={current.name}
            onChange={(e) =>
              dispatch(CurrentProjectActions.updateProjectFields({ name: e.target.value }))
            }
            placeholder="Project name"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>App Type</label>
          <select
            value={current.app_type ?? 'custom'}
            onChange={(e) =>
              dispatch(
                CurrentProjectActions.updateProjectFields({
                  app_type: e.target.value,
                })
              )
            }
            className={styles.input}
          >
            <option value="custom">Custom</option>
            <option value="marketplace">Marketplace</option>
            <option value="field_service">Field Service</option>
            <option value="social">Social Network</option>
            <option value="saas">SaaS Platform</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            value={current.description ?? ''}
            onChange={(e) =>
              dispatch(
                CurrentProjectActions.updateProjectFields({
                  description: e.target.value || null,
                })
              )
            }
            placeholder="Optional description"
            className={styles.textarea}
          />
        </div>
        <div className={styles.buttons}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.saveButton}
            disabled={!current.name.trim()}
          >
            Add
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
  field: `
    mb-4
  `,
  label: `
    block text-sm font-medium text-gray-700 mb-1
  `,
  input: `
    w-full px-3 py-2 border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
  textarea: `
    w-full px-3 py-2 border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500
    min-h-[80px]
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
