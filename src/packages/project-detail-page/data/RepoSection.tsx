'use client';

import { useAppSelector } from '@/store';
import type { ProjectRepo } from '@/api/project-setup';
import type { DataEntityWithFields } from '@/model/data-entity';
import { updateRepoPhase } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { PhaseProgress } from './PhaseProgress';
import { EntityCard } from './EntityCard';
import { PHASES, getNextPhase, getTaskTypesForPhase } from './phaseConfig';

type RepoSectionProps = {
  repo: ProjectRepo;
  entities: DataEntityWithFields[];
};

const styles = {
  section: `
    rounded-lg border border-gray-200 bg-white p-4 mb-6
  `,
  title: `
    text-lg font-semibold text-gray-900 mb-2
  `,
  description: `
    text-sm text-gray-500 mb-4
  `,
  phaseTitle: `
    text-sm font-medium text-gray-700 mb-3
  `,
  entityContainer: `
    space-y-3 mb-4
  `,
  advanceButton: `
    rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors
  `,
};

export const RepoSection = ({ repo, entities }: RepoSectionProps) => {
  const projectId = useAppSelector((state) => state.currentProject?.id);
  // Stubbed - code generation moved to DataModelPhase
  const selectedTasks: any[] = [];
  const generationTasks: any[] = [];

  const currentPhase = repo.current_phase || 'data_model';
  const phaseConfig = PHASES.find((p) => p.id === currentPhase);
  const taskTypes = getTaskTypesForPhase(currentPhase);
  const nextPhase = getNextPhase(currentPhase);

  const allEntitiesCompleteForPhase = (): boolean => {
    if (entities.length === 0) return false;
    for (const entity of entities) {
      for (const taskType of taskTypes) {
        const task = generationTasks.find((t) => t.task_type === taskType);
        if (!task) continue;
        const selected = selectedTasks.find(
          (s) => s.entity_id === entity.id && s.task_id === task.id
        );
        if (!selected || selected.status !== 'completed') {
          return false;
        }
      }
    }
    return true;
  };

  const handleAdvancePhase = async () => {
    if (!nextPhase || !projectId) return;
    const res = await updateRepoPhase(
      projectId,
      repo.id,
      { current_phase: nextPhase },
      getApiBaseUrl()
    );
    if (!res.success) {
      alert('Could not advance phase. Ensure all tasks for the current phase are completed.');
    }
    // Note: Repo will be updated via WebSocket or next page refresh
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{repo.name}</h2>
      <PhaseProgress currentPhase={currentPhase} />
      <h3 className={styles.phaseTitle}>
        {phaseConfig?.name ?? currentPhase}
      </h3>
      <div className={styles.entityContainer}>
        {entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            currentPhase={currentPhase}
            platformId={repo.id}
          />
        ))}
      </div>
      {nextPhase && allEntitiesCompleteForPhase() && projectId && (
        <button
          onClick={handleAdvancePhase}
          className={styles.advanceButton}
        >
          Advance to {PHASES.find((p) => p.id === nextPhase)?.name ?? nextPhase}
        </button>
      )}
    </section>
  );
};
