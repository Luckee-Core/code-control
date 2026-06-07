/**
 * Operations Dropdown
 * 
 * Expandable checklist of CRUD operations grouped by category.
 * Displayed when user clicks chevron on entity pill.
 */

'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { CrudApiBuilderActions } from '@/store/builders';
import type { CrudOperation } from '../../../crud-operations';

type OperationsDropdownProps = {
  entityId: string;
  operations: {
    base: CrudOperation[];
    extended: CrudOperation[];
    relationship: CrudOperation[];
    custom: CrudOperation[];
  };
};

export const OperationsDropdown = ({ entityId, operations }: OperationsDropdownProps) => {
  const dispatch = useAppDispatch();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['base', 'relationship']) // Base and relationship expanded by default
  );

  // Get selected operations for this entity
  const selectedOperations = useAppSelector(
    (state) => state.crudApiBuilder.entityOperationSelections[entityId] || []
  );

  const handleOperationToggle = (operationKey: string) => {
    dispatch(CrudApiBuilderActions.toggleOperationSelection({ entityId, operationKey }));
  };

  const handleCategoryToggle = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelectAllCategory = (category: keyof typeof operations) => {
    const categoryOps = operations[category];
    const allSelected = categoryOps.every((op) => selectedOperations.includes(op.key));
    
    if (allSelected) {
      // Deselect all in category
      const newSelections = selectedOperations.filter(
        (key) => !categoryOps.some((op) => op.key === key)
      );
      dispatch(CrudApiBuilderActions.setEntityOperations({ 
        entityId, 
        operationKeys: newSelections 
      }));
    } else {
      // Select all in category
      const categoryKeys = categoryOps.map((op) => op.key);
      const newSelections = [...new Set([...selectedOperations, ...categoryKeys])];
      dispatch(CrudApiBuilderActions.setEntityOperations({ 
        entityId, 
        operationKeys: newSelections 
      }));
    }
  };

  const renderCategory = (
    category: keyof typeof operations,
    label: string,
    icon: string
  ) => {
    const categoryOps = operations[category];
    if (categoryOps.length === 0) return null;

    const isExpanded = expandedCategories.has(category);
    const allSelected = categoryOps.every((op) => selectedOperations.includes(op.key));
    const someSelected = categoryOps.some((op) => selectedOperations.includes(op.key));

    return (
      <div key={category} className={styles.category}>
        <div className={styles.categoryHeader}>
          <button
            onClick={() => handleCategoryToggle(category)}
            className={styles.categoryToggle}
          >
            <span className={styles.chevron}>{isExpanded ? '▼' : '▶'}</span>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
            <span className={styles.count}>({categoryOps.length})</span>
          </button>
          <button
            onClick={() => handleSelectAllCategory(category)}
            className={styles.selectAll}
          >
            {allSelected ? 'Deselect All' : someSelected ? 'Select All' : 'Select All'}
          </button>
        </div>

        {isExpanded && (
          <div className={styles.operationsList}>
            {categoryOps.map((operation) => (
              <label key={operation.key} className={styles.operationRow}>
                <input
                  type="checkbox"
                  checked={selectedOperations.includes(operation.key)}
                  onChange={() => handleOperationToggle(operation.key)}
                  className={styles.checkbox}
                />
                <div className={styles.operationInfo}>
                  <div className={styles.operationHeader}>
                    <span className={styles.operationLabel}>{operation.label}</span>
                    <span className={`${styles.methodBadge} ${styles[`method${operation.method}`]}`}>
                      {operation.method}
                    </span>
                  </div>
                  <div className={styles.operationDetails}>
                    <span className={styles.urlPattern}>{operation.urlPattern}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.description}>{operation.description}</span>
                  </div>
                  {operation.generatedFrom && (
                    <div className={styles.generatedFrom}>
                      ↳ Generated from FK: <code>{operation.generatedFrom.fieldName}</code> → {operation.generatedFrom.referencedEntity}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <h4 className={styles.title}>Select Operations</h4>
      </div>
      {renderCategory('base', 'Base Operations', '📦')}
      {renderCategory('extended', 'Extended Operations', '⚡')}
      {renderCategory('relationship', 'Relationship Operations', '🔗')}
      {renderCategory('custom', 'Custom Operations', '🎨')}
    </div>
  );
};

const styles = {
  dropdown: `
    p-4
  `,
  header: `
    pb-3 mb-3 border-b border-gray-200
  `,
  title: `
    font-semibold text-gray-900 text-base
  `,
  category: `
    mb-3 last:mb-0
  `,
  categoryHeader: `
    flex items-center justify-between
    mb-2
  `,
  categoryToggle: `
    flex items-center gap-2
    text-sm font-medium text-gray-700
    hover:text-gray-900
    transition-colors
  `,
  chevron: `
    text-xs text-gray-400
  `,
  icon: `
    text-base
  `,
  label: `
    font-semibold
  `,
  count: `
    text-gray-500 text-xs
  `,
  selectAll: `
    text-xs text-blue-600 hover:text-blue-700
    font-medium px-2 py-1
    hover:bg-blue-50 rounded
    transition-colors
  `,
  operationsList: `
    space-y-2
    pl-4 border-l-2 border-gray-100
  `,
  operationRow: `
    flex items-start gap-3
    p-2 rounded
    hover:bg-gray-50
    cursor-pointer
    transition-colors
  `,
  checkbox: `
    mt-1
  `,
  operationInfo: `
    flex-1 min-w-0
  `,
  operationHeader: `
    flex items-center gap-2
    mb-1
  `,
  operationLabel: `
    font-medium text-gray-900
    text-sm
  `,
  methodBadge: `
    px-2 py-0.5 rounded text-xs font-mono font-semibold
  `,
  methodGET: `
    bg-blue-100 text-blue-800
  `,
  methodPOST: `
    bg-green-100 text-green-800
  `,
  methodPATCH: `
    bg-yellow-100 text-yellow-800
  `,
  methodDELETE: `
    bg-red-100 text-red-800
  `,
  operationDetails: `
    flex items-center gap-2
    text-xs text-gray-600
  `,
  urlPattern: `
    font-mono bg-gray-100 px-1.5 py-0.5 rounded
  `,
  separator: `
    text-gray-400
  `,
  description: `
    flex-1 min-w-0
  `,
  generatedFrom: `
    text-xs text-gray-500 italic
    mt-1 pl-2
  `,
};
