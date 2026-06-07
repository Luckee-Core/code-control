'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { deleteDataEntityFieldThunk } from '@/store/thunks/data-entity-fields';
import { deleteDataEntityThunk } from '@/store/thunks/data-entities';
import { getReposByProjectId } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import type { ProjectRepo } from '@/api/project-setup';
import type { DataEntityWithFields } from '@/model/data-entity';
import { TableEditorHeader } from './TableEditorHeader';
import { TableFieldsGrid } from './TableFieldsGrid';
import { TableEditorFooter } from './TableEditorFooter';

type TableEditorProps = {
  entity: DataEntityWithFields;
};

const styles = {
  wrapper: `
    flex-1 flex flex-col h-full overflow-hidden
  `,
};

export const TableEditor = ({ entity }: TableEditorProps) => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const entities = useAppSelector((state) =>
    state.dataEntities.filter((e) => e.project_id === currentProject?.id)
  ) as DataEntityWithFields[];
  const [repos, setRepos] = useState<ProjectRepo[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchRepos = useCallback(async () => {
    if (!currentProject?.id) return;
    const res = await getReposByProjectId(currentProject.id, getApiBaseUrl());
    if (res.success && res.data) setRepos(res.data);
  }, [currentProject?.id]);

  useEffect(() => {
    void fetchRepos();
  }, [fetchRepos]);

  const assignedRepoIds = entity.assigned_repo_ids ?? [];
  const assignedRepos = repos.filter((r) => assignedRepoIds.includes(r.id));

  const handleDeleteField = async (fieldId: string) => {
    await dispatch(deleteDataEntityFieldThunk(entity.id, fieldId));
  };

  const handleDeleteEntity = async () => {
    if (confirmDelete) {
      await dispatch(deleteDataEntityThunk(entity.id));
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className={styles.wrapper}>
      <TableEditorHeader
        entity={entity}
        assignedRepos={assignedRepos}
        confirmDelete={confirmDelete}
        onDeleteEntity={handleDeleteEntity}
      />
      <TableFieldsGrid
        entity={entity}
        entities={entities}
        onDeleteField={handleDeleteField}
      />
      <TableEditorFooter
        fieldCount={entity.fields?.length ?? 0}
        assignedRepos={assignedRepos}
      />
    </div>
  );
};
