'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { getPhasesForRepoType } from '@/config/project-setup';
import { PhaseRow } from './PhaseRow';
import type { RepoType } from '@/api/project-setup/types';

const API_REPO_TYPE_TO_CONFIG: Record<RepoType, 'express' | 'nextjs' | 'react-native'> = {
  express: 'express',
  web: 'nextjs',
  mobile: 'react-native',
};

type PhasesListProps = {
  repoId: string;
  repoType: RepoType;
};

export const PhasesList = ({ repoId, repoType }: PhasesListProps) => {
  const dispatch = useAppDispatch();
  const activeGuidedRepoId = useAppSelector(
    (state) => state.workspaceBuilder.activeGuidedRepoId
  );
  const activeGuidedPhaseId = useAppSelector(
    (state) => state.workspaceBuilder.activeGuidedPhaseId
  );
  const phases = getPhasesForRepoType(API_REPO_TYPE_TO_CONFIG[repoType]);

  const handleDetailsClick = () => {
    dispatch(WorkspaceBuilderActions.setActiveGuidedRepoId(repoId));
    dispatch(WorkspaceBuilderActions.setActiveGuidedPhaseId('details'));
  };

  const isDetailsActive = activeGuidedRepoId === repoId && activeGuidedPhaseId === 'details';

  return (
    <div className={styles.list}>
      <button
        type="button"
        onClick={handleDetailsClick}
        className={`${styles.detailsButton} ${isDetailsActive ? styles.detailsButtonActive : ''}`}
      >
        Details
      </button>
      {phases.map((phase) => (
        <PhaseRow
          key={phase.id}
          repoId={repoId}
          phase={phase}
          isActive={
            activeGuidedRepoId === repoId && activeGuidedPhaseId === phase.id
          }
        />
      ))}
    </div>
  );
};

const styles = {
  list: `
    ml-6 mt-1 space-y-0.5 mb-2
  `,
  detailsButton: `
    w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors
    border-none bg-transparent cursor-pointer text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50
  `,
  detailsButtonActive: `
    bg-blue-100 text-blue-700 font-medium
  `,
};
