/**
 * Entity Pill Row
 * 
 * Simple chip matching EntityAssignmentSection - click to select, chevron for dropdown.
 */

'use client';

import { useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { CrudApiBuilderActions } from '@/store/builders';
import { OperationsDropdown } from './operations-dropdown';
import type { EntityWithOperations } from '../../types';

type EntityPillRowProps = {
  entity: EntityWithOperations;
};

export const EntityPillRow = ({ entity }: EntityPillRowProps) => {
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isSelected = useAppSelector((state) =>
    state.crudApiBuilder.selectedEntityIds.includes(entity.id)
  );
  
  const isExpanded = useAppSelector((state) =>
    state.crudApiBuilder.expandedEntityId === entity.id
  );

  const selectedOpsCount = useAppSelector((state) => {
    const selections = state.crudApiBuilder.entityOperationSelections[entity.id] || [];
    return selections.length;
  });

  const baseOperationKeys = entity.operationsByCategory.base.map((op) => op.key);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        dispatch(CrudApiBuilderActions.setExpandedEntity(null));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, dispatch]);

  const handleChipClick = () => {
    dispatch(CrudApiBuilderActions.toggleEntitySelection({ 
      entityId: entity.id, 
      baseOperationKeys 
    }));
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(CrudApiBuilderActions.toggleExpandedEntity(entity.id));
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleChipClick}
        className={`${styles.chip} ${isSelected ? styles.chipSelected : styles.chipUnselected}`}
      >
        <span className={styles.chipText}>{entity.name}</span>
        
        {selectedOpsCount > 0 && (
          <span className={styles.opsCount}>
            {selectedOpsCount}
          </span>
        )}

        <div
          onClick={handleChevronClick}
          className={styles.chevronButton}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleChevronClick(e as unknown as React.MouseEvent);
            }
          }}
        >
          <span className={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {isExpanded && (
        <div className={styles.dropdownPopup}>
          <OperationsDropdown
            entityId={entity.id}
            operations={entity.operationsByCategory}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `
    relative
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
  opsCount: `
    px-1.5 py-0.5 rounded-full
    bg-blue-600 text-white
    text-xs font-semibold
    min-w-[1.25rem] text-center
  `,
  chevronButton: `
    p-0.5 rounded hover:bg-gray-200
    text-gray-500 hover:text-gray-700
    transition-colors
  `,
  chevron: `
    text-xs
  `,
  dropdownPopup: `
    absolute top-full left-0 mt-2
    z-50
    min-w-[400px] max-w-[500px]
    bg-white rounded-lg shadow-xl border border-gray-200
    max-h-[70vh] overflow-y-auto
  `,
};
