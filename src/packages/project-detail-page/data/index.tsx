'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';
import type { DataEntityWithFields } from '@/model/data-entity';
import { TableSidebar } from './TableSidebar';
import { TableEditor } from './TableEditor';
import { SqlPreviewPanel } from './SqlPreviewPanel';

const styles = {
  tabContent: `
    flex-1 overflow-hidden flex flex-col
  `,
  container: `
    max-w-4xl
  `,
  dataTabLayout: `
    flex flex-1 min-h-0
  `,
  emptyEditor: `
    flex-1 flex flex-col items-center justify-center text-gray-500
  `,
  emptyEditorIcon: `
    h-12 w-12 mb-3 opacity-20
  `,
  emptyEditorTitle: `
    text-sm font-medium
  `,
  emptyEditorHint: `
    text-xs mt-1
  `,
};

/** Data tab: project entities, table editor, SQL preview. */
export const BackendOnboarding = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const allEntities = useAppSelector((state) => state.dataEntities) as DataEntityWithFields[];
  const selectedEntityId = useAppSelector((state) => state.workspaceBuilder.selectedDataEntityId);

  const projectEntities = allEntities.filter((e) => e.project_id === currentProject?.id);
  const selectedEntity = projectEntities.find((e) => e.id === selectedEntityId) ?? null;

  const handleSelectEntity = (entityId: string | null) => {
    dispatch(WorkspaceBuilderActions.setSelectedDataEntityId(entityId));
  };

  useEffect(() => {
    if (!selectedEntityId && projectEntities.length > 0) {
      dispatch(WorkspaceBuilderActions.setSelectedDataEntityId(projectEntities[0].id));
    }
  }, [selectedEntityId, projectEntities, dispatch]);

  if (!currentProject) {
    return (
      <div className={styles.tabContent}>
        <div className={styles.container}>
          <p className="text-sm text-gray-500 italic">No project selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.dataTabLayout}>
        <TableSidebar
          selectedEntityId={selectedEntityId}
          onSelectEntity={handleSelectEntity}
        />
        {selectedEntity ? (
          <TableEditor entity={selectedEntity} />
        ) : (
          <div className={styles.emptyEditor}>
            <svg
              className={styles.emptyEditorIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className={styles.emptyEditorTitle}>Select a table</p>
            <p className={styles.emptyEditorHint}>
              Choose a table from the sidebar or create a new one
            </p>
          </div>
        )}
        <SqlPreviewPanel entity={selectedEntity} />
      </div>
    </div>
  );
};

export { RepoSection } from './RepoSection';
export { PhaseProgress } from './PhaseProgress';
export { BackendOnboardingHeader } from './BackendOnboardingHeader';
export { EntitiesSection } from './EntitiesSection';
export { AddEntityForm } from './AddEntityForm';
export { EntityAccordion } from './EntityAccordion';
export { EntityGroup } from './EntityGroup';
export { EntityCard } from './EntityCard';
export { EntityFieldRow } from './EntityFieldRow';
export { AddFieldForm } from './AddFieldForm';
export { FieldsTable } from './FieldsTable';
export { TableSidebar } from './TableSidebar';
export { TableEditor } from './TableEditor';
export { TableEditorHeader } from './TableEditorHeader';
export { FieldRow } from './FieldRow';
export { AddFieldRow } from './AddFieldRow';
export { TableFieldsGrid } from './TableFieldsGrid';
export { TableEditorFooter } from './TableEditorFooter';
export { SqlPreviewPanel } from './SqlPreviewPanel';
