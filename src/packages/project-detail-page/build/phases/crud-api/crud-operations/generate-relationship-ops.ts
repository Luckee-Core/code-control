/**
 * Relationship Operations Generator
 * 
 * Auto-generates CRUD operations based on foreign key relationships.
 */

import type { CrudOperation } from './types';
import type { DataEntityWithFields } from '@/model/data-entity';

/**
 * Simple pluralization helper
 * 
 * @param name - Singular name (e.g., 'user', 'task')
 * @returns Pluralized name (e.g., 'users', 'tasks')
 */
const simplePlural = (name: string): string => {
  if (name.endsWith('s')) return `${name}es`;
  if (name.endsWith('y')) return `${name.slice(0, -1)}ies`;
  return `${name}s`;
};

/**
 * Capitalizes the first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert camelCase to kebab-case
 * Example: getByAssigneeId -> get-by-assignee-id
 * 
 * @param str - camelCase string
 * @returns kebab-case string
 */
const toKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Generates relationship-based CRUD operations from foreign key fields
 * 
 * For each FK field in the entity, generates a "getByX" operation.
 * 
 * Example: Entity "Task" with field "assignee_id" → User
 * Generates: getByAssigneeId operation with URL /assignee/:assigneeId
 * 
 * @param entity - The entity to generate operations for
 * @param allEntities - All entities (to resolve FK references)
 * @returns Array of relationship-based operations
 */
export const generateRelationshipOperations = (
  entity: DataEntityWithFields,
  allEntities: DataEntityWithFields[]
): CrudOperation[] => {
  const ops: CrudOperation[] = [];
  const fields = entity.fields ?? [];
  const tableName = entity.table_name || entity.name.toLowerCase();
  const entityPlural = simplePlural(tableName);

  for (const field of fields) {
    // Skip non-FK fields
    if (!field.references_entity_id) continue;

    // Find the referenced entity
    const refEntity = allEntities.find((e) => e.id === field.references_entity_id);
    if (!refEntity) continue;

    // Extract field base name (remove _id suffix)
    // Example: assignee_id → assignee, workspace_id → customer
    const fieldBaseName = field.name.replace(/_id$/, '');
    const capitalizedField = capitalize(fieldBaseName);
    
    // Generate operation key in camelCase first, then convert to kebab-case
    // Example: getByAssigneeId -> get-by-assignee-id
    const camelKey = `getBy${capitalizedField}Id`;
    const operationKey = toKebabCase(camelKey);
    
    // Generate URL pattern
    // Example: /assignee/:assigneeId
    const urlPattern = `/${fieldBaseName}/:${field.name}`;

    ops.push({
      key: operationKey,
      label: `Get By ${capitalizedField}`,
      method: 'GET',
      urlPattern,
      description: `Get ${entityPlural} by ${fieldBaseName} ID`,
      category: 'relationship',
      generatedFrom: {
        fieldName: field.name,
        referencedEntity: refEntity.name,
      },
    });
  }

  return ops;
};
