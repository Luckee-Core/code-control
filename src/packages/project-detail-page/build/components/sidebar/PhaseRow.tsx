'use client';

import { useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import type { Phase } from '@/config/project-setup';

type PhaseRowProps = {
  repoId: string;
  phase: Phase;
  isActive: boolean;
};

export const PhaseRow = ({ repoId, phase, isActive }: PhaseRowProps) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(WorkspaceBuilderActions.setActiveGuidedRepoId(repoId));
    dispatch(WorkspaceBuilderActions.setActiveGuidedPhaseId(phase.id));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${isActive ? styles.buttonActive : ''}`}
    >
      {phase.name}
    </button>
  );
};

const styles = {
  button: `
    w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors
    border-none bg-transparent cursor-pointer text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50
  `,
  buttonActive: `
    bg-blue-100 text-blue-700 font-medium
  `,
};
