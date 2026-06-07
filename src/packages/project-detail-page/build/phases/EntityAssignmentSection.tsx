'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { DataEntitiesActions } from '@/store/dumps';
import { updateDataEntity } from '@/api/data-entities';
import { getApiBaseUrl } from '@/api/config';
import type { DataEntityWithFields } from '@/model/data-entity';

type EntityAssignmentSectionProps = {
  repoId: string;
  repoName: string;
  phaseId: string;
};

export const EntityAssignmentSection = ({
  repoId,
  repoName,
}: EntityAssignmentSectionProps) => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const dataEntities = useAppSelector((state) => state.dataEntities);
  const projectEntities = dataEntities.filter(
    (e) => e.project_id === currentProject?.id
  ) as DataEntityWithFields[];

  const [savedId, setSavedId] = useState<string | null>(null);

  const assignedCount = projectEntities.filter((e) =>
    (e.assigned_repo_ids ?? []).includes(repoId)
  ).length;

  const toggleEntityAssignment = async (
    entityId: string,
    currentlyAssigned: boolean
  ) => {
    const entity = projectEntities.find((e) => e.id === entityId);
    if (!entity) return;
    const currentIds = entity.assigned_repo_ids ?? [];
    const nextIds = currentlyAssigned
      ? currentIds.filter((id) => id !== repoId)
      : [...currentIds, repoId];
    const res = await updateDataEntity(
      entityId,
      { assigned_repo_ids: nextIds },
      getApiBaseUrl()
    );
    if (res.success && res.data) {
      dispatch(DataEntitiesActions.updateDataEntity({ ...entity, ...res.data }));
      setSavedId(entityId);
      setTimeout(() => setSavedId(null), 1500);
    }
  };

  if (projectEntities.length === 0) {
    return (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>
          Add entities in the Data tab first.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.headerText}>Assign entities to {repoName}:</span>
        <span className={styles.countText}>
          {assignedCount} of {projectEntities.length} selected
        </span>
      </div>
      <div className={styles.chipContainer}>
        {projectEntities.map((entity) => {
          const assigned = (entity.assigned_repo_ids ?? []).includes(repoId);
          const justSaved = savedId === entity.id;

          return (
            <button
              key={entity.id}
              type="button"
              onClick={() => toggleEntityAssignment(entity.id, assigned)}
              className={`${styles.chip} ${
                assigned ? styles.chipSelected : styles.chipUnselected
              }`}
            >
              <span className={styles.chipText}>{entity.name}</span>
              {justSaved && (
                <span className={styles.savedIndicator}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  section: `
    flex flex-col gap-2 pb-4 border-b border-gray-200
  `,
  header: `
    flex items-center justify-between
  `,
  headerText: `
    text-sm font-medium text-gray-700
  `,
  emptySection: `
    text-center py-4
  `,
  emptyText: `
    text-xs text-gray-500
  `,
  chipContainer: `
    flex flex-wrap gap-2
  `,
  chip: `
    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
    transition-all border cursor-pointer
  `,
  chipUnselected: `
    bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300
  `,
  chipSelected: `
    bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100
  `,
  chipText: `
    text-sm
  `,
  savedIndicator: `
    text-green-600 font-bold
  `,
  countText: `
    text-xs text-gray-500
  `,
};
