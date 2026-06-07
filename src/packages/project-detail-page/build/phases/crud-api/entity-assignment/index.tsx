/**
 * CRUD API Table
 * 
 * Simple chip layout matching EntityAssignmentSection design.
 */

'use client';

import { useState, useMemo } from 'react';
import { useAppSelector } from '@/store';
import { EntityPillRow } from './row';
import type { EntityWithOperations } from '../types';

type CrudApiTableProps = {
  entities: EntityWithOperations[];
  repoId: string;
  repoName: string;
};

export const CrudApiTable = ({ entities, repoId, repoName }: CrudApiTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEntityIds = useAppSelector((state) => state.crudApiBuilder.selectedEntityIds);

  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return entities;
    
    const query = searchQuery.toLowerCase();
    return entities.filter((entity) => {
      return (
        entity.name.toLowerCase().includes(query) ||
        entity.table_name?.toLowerCase().includes(query) ||
        entity.description?.toLowerCase().includes(query)
      );
    });
  }, [entities, searchQuery]);

  const handleGenerate = async () => {
    console.log('Generate clicked', selectedEntityIds);
  };

  const hasSelections = selectedEntityIds.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerText}>
          Select entities to generate CRUD operations for {repoName}:
        </span>
        <span className={styles.countText}>
          {selectedEntityIds.length} of {entities.length} selected
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
      </div>
    </div>
  );
};

const styles = {
  container: `
    flex flex-col gap-4 p-2
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
};
