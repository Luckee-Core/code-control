'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import { EntityAssignmentSection } from './EntityAssignmentSection';
import { DataModelQueueTable } from './data-model/table';

type DataModelPhaseProps = {
  repoId: string;
  repoName: string;
  phaseId: string;
};

export const DataModelPhase = ({ repoId, repoName, phaseId }: DataModelPhaseProps) => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const entities = useAppSelector((state) =>
    state.dataEntities.filter((e) => e.project_id === currentProject?.id)
  );

  return (
    <div className={styles.container}>
      {/* Entity Assignment */}
      <EntityAssignmentSection
        repoId={repoId}
        repoName={repoName}
        phaseId={phaseId}
      />

      {/* Code Generation Queue Table */}
      {entities.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            No entities defined yet.{' '}
            <button
              type="button"
              onClick={() =>
                dispatch(
                  WorkspaceBuilderActions.setActiveWorkspaceView('data')
                )
              }
              className={styles.emptyLink}
            >
              Go to Data tab to add entities →
            </button>
          </p>
        </div>
      ) : (
        <DataModelQueueTable repoId={repoId} repoName={repoName} />
      )}
    </div>
  );
};

const styles = {
  container: `
    space-y-6
  `,
  emptyState: `
    text-center py-12 rounded-lg border border-dashed border-gray-200 bg-gray-50
  `,
  emptyText: `
    text-sm text-gray-500
  `,
  emptyLink: `
    text-blue-600 hover:underline font-medium border-none bg-transparent cursor-pointer
  `,
};
