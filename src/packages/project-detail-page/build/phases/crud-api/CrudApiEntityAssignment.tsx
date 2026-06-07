/**
 * CRUD API Entity Assignment
 * 
 * Simple entity selection section matching EntityAssignmentSection design.
 */

'use client';

import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { getCrudOperationsForEntity } from './crud-operations';
import { EntityPillRow } from './entity-assignment/row';
import {
  createCrudApiQueueItemsThunk,
  createTableNamesConfigQueueItemThunk,
} from '@/store/thunks/crud-api-generation-queue';
import type { EntityWithOperations } from './types';

type CrudApiEntityAssignmentProps = {
  repoId: string;
  repoName: string;
};

export const CrudApiEntityAssignment = ({ repoId, repoName }: CrudApiEntityAssignmentProps) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEntityIds = useAppSelector((state) => state.crudApiBuilder.selectedEntityIds);
  const entityOperationSelections = useAppSelector((state) => state.crudApiBuilder.entityOperationSelections);
  const dataEntities = useAppSelector((state) => state.dataEntities);
  
  const allEntities = useMemo(
    () => dataEntities.filter((entity) => entity.assigned_repo_ids?.includes(repoId)),
    [dataEntities, repoId]
  );

  const entitiesWithOperations = useMemo((): EntityWithOperations[] => {
    return allEntities.map((entity) => {
      const operations = getCrudOperationsForEntity(entity, allEntities, {
        includeExtended: true,
        includeRelationships: true,
      });

      const operationsByCategory = {
        base: operations.filter((op) => op.category === 'base'),
        extended: operations.filter((op) => op.category === 'extended'),
        relationship: operations.filter((op) => op.category === 'relationship'),
        custom: operations.filter((op) => op.category === 'custom'),
      };

      return {
        id: entity.id,
        name: entity.name,
        table_name: entity.table_name,
        description: entity.description,
        operations,
        operationsByCategory,
      };
    });
  }, [allEntities]);

  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return entitiesWithOperations;
    
    const query = searchQuery.toLowerCase();
    return entitiesWithOperations.filter((entity) => {
      return (
        entity.name.toLowerCase().includes(query) ||
        entity.table_name?.toLowerCase().includes(query) ||
        entity.description?.toLowerCase().includes(query)
      );
    });
  }, [entitiesWithOperations, searchQuery]);

  const handleGenerate = async () => {
    const result = await dispatch(createCrudApiQueueItemsThunk());
    if (result === 200) {
      console.log('Queue items created successfully');
    }
  };

  const [tableNamesConfigLoading, setTableNamesConfigLoading] = useState(false);
  const handleTableNamesConfig = async () => {
    setTableNamesConfigLoading(true);
    const result = await dispatch(createTableNamesConfigQueueItemThunk(repoId));
    setTableNamesConfigLoading(false);
    if (result === 200) {
      console.log('Table names config queued successfully');
    }
  };

  const hasSelections =
    selectedEntityIds.some(
      (entityId) => (entityOperationSelections[entityId]?.length ?? 0) > 0
    );

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.headerText}>
          Select entities to generate CRUD operations for {repoName}:
        </span>
        <span className={styles.countText}>
          {selectedEntityIds.length} of {entitiesWithOperations.length} selected
        </span>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search entities..."
        className={styles.searchInput}
      />

      <div className={styles.chipContainer}>
        {filteredEntities.map((entity) => (
          <EntityPillRow
            key={entity.id}
            entity={entity}
          />
        ))}
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleGenerate}
          disabled={!hasSelections}
          className={styles.generateButton}
        >
          Generate CRUD Operations
        </button>
        <button
          onClick={handleTableNamesConfig}
          disabled={tableNamesConfigLoading}
          className={styles.tableNamesConfigButton}
        >
          {tableNamesConfigLoading ? 'Queuing…' : 'Create/update table names config'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  section: `
    flex flex-col gap-3 pb-4 border-b border-gray-200
  `,
  header: `
    flex items-center justify-between
  `,
  headerText: `
    text-sm font-medium text-gray-700
  `,
  countText: `
    text-xs text-gray-500
  `,
  searchInput: `
    w-full px-4 py-2
    border border-gray-300 rounded-lg
    text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  `,
  chipContainer: `
    flex flex-wrap gap-2
  `,
  actions: `
    flex items-center gap-3
  `,
  generateButton: `
    px-4 py-2 rounded-lg
    text-sm font-medium
    bg-blue-600 text-white
    hover:bg-blue-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
  tableNamesConfigButton: `
    px-4 py-2 rounded-lg
    text-sm font-medium
    bg-gray-600 text-white
    hover:bg-gray-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
};
