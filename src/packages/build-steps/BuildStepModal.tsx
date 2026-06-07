import { useAppSelector, useAppDispatch } from '@/store';
import { BuildStepBuilderActions } from '@/store/builders/buildStepBuilder';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';
import { createBuildStepThunk, updateBuildStepThunk } from '@/store/thunks/build-steps';
import type { BuildStep } from '@/model';
import {
  NameInput,
  DescriptionInput,
  RepoTypeInput,
  SortOrderInput,
  IsActiveInput,
} from './inputs';

export const BuildStepModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.buildStepBuilder.isModalOpen);
  const isLoading = useAppSelector((state) => state.buildStepBuilder.isLoading);
  const editingStepId = useAppSelector((state) => state.buildStepBuilder.editingStepId);
  const currentStep = useAppSelector((state) => state.currentBuildStep) as BuildStep | null;

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(BuildStepBuilderActions.closeBuildStepModal());
    dispatch(CurrentBuildStepActions.clearCurrentBuildStep(undefined));
  };

  const handleSave = async () => {
    if (!currentStep?.name || !currentStep?.repo_type) return;

    if (editingStepId) {
      await dispatch(
        updateBuildStepThunk(editingStepId, {
          name: currentStep.name,
          description: currentStep.description ?? undefined,
          repo_type: currentStep.repo_type,
          sort_order: currentStep.sort_order,
          is_active: currentStep.is_active,
        })
      );
    } else {
      await dispatch(createBuildStepThunk({
        name: currentStep.name,
        description: currentStep.description ?? undefined,
        repo_type: currentStep.repo_type as 'express' | 'nextjs' | 'react-native',
        sort_order: currentStep.sort_order,
        is_active: currentStep.is_active,
      }));
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {editingStepId ? 'Edit Build Step' : 'Create Build Step'}
          </h2>
          <button onClick={handleClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <NameInput />
          <DescriptionInput />
          <RepoTypeInput />
          <SortOrderInput />
          <IsActiveInput />
        </div>

        <div className={styles.footer}>
          <button onClick={handleClose} className={styles.cancelButton} disabled={isLoading}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
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
    w-full max-w-2xl max-h-[90vh] overflow-auto
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
    transition-colors
  `,
  content: `
    px-6 py-4 space-y-4
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
    transition-colors
  `,
  saveButton: `
    px-4 py-2 bg-blue-600 text-white rounded-lg
    font-medium
    hover:bg-blue-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
};
