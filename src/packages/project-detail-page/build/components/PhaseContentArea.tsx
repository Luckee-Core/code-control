'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { getPhasesForRepoType } from '@/config/project-setup';
import { NoRepoOrPhaseSelected, NoPhaseSelected } from './EmptyStates';
import { ARDManager } from '../build-foundation';
import { DataModelPhase, RepoDetails, CrudApiPhase } from '../phases';

export const PhaseContentArea = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const repos = useAppSelector((state) => state.projectRepos);
  const activeGuidedRepoId = useAppSelector(
    (state) => state.workspaceBuilder.activeGuidedRepoId
  );
  const activeGuidedPhaseId = useAppSelector(
    (state) => state.workspaceBuilder.activeGuidedPhaseId
  );

  const projectRepos = repos.filter(
    (r) => r.project_id === currentProject?.id
  );

  useEffect(() => {
    if (
      !activeGuidedRepoId &&
      !activeGuidedPhaseId &&
      projectRepos.length > 0 &&
      currentProject?.id
    ) {
      const firstRepo = projectRepos[0];
      const phases = getPhasesForRepoType(firstRepo.repo_type);
      if (phases.length > 0) {
        dispatch(WorkspaceBuilderActions.setActiveGuidedRepoId(firstRepo.id));
        dispatch(WorkspaceBuilderActions.setActiveGuidedPhaseId(phases[0].id));
      }
    }
  }, [activeGuidedRepoId, activeGuidedPhaseId, projectRepos, currentProject?.id, dispatch]);

  const activeRepo = projectRepos.find((r) => r.id === activeGuidedRepoId);
  const phases = activeRepo ? getPhasesForRepoType(activeRepo.repo_type) : [];
  const phase = phases.find((p) => p.id === activeGuidedPhaseId);

  // Allow 'details' as a special phase ID
  const isDetailsPhase = activeGuidedPhaseId === 'details';

  if (projectRepos.length === 0) {
    return (
      <div className={styles.content}>
        <NoRepoOrPhaseSelected />
      </div>
    );
  }

  if (!activeRepo) {
    return (
      <div className={styles.content}>
        <NoRepoOrPhaseSelected />
      </div>
    );
  }

  if (!phase && !isDetailsPhase) {
    return (
      <div className={styles.content}>
        <NoPhaseSelected />
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.phaseContent}>
        {isDetailsPhase && (
          <RepoDetails repoId={activeRepo.id} />
        )}
        
        {phase?.id === 'build_foundation' && activeRepo && (
          <ARDManager />
        )}
        
        {phase?.id === 'data_model' && (
          <DataModelPhase
            repoId={activeRepo.id}
            repoName={activeRepo.name}
            phaseId={phase.id}
          />
        )}
        
        {phase?.id === 'crud_api' && (
          <CrudApiPhase
            repoId={activeRepo.id}
            repoName={activeRepo.name}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  content: `
    flex-1 min-h-0 overflow-y-auto bg-gray-50/50
  `,
  phaseContent: `
    w-full p-2
  `,
  comingSoonText: `
    text-sm text-gray-500
  `,
};
