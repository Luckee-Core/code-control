/**
 * CRUD Operations Orchestrator
 * 
 * Main function that combines all operation types (base, extended, relationship, custom)
 * and returns the complete catalog of operations for an entity.
 */

import type { CrudOperation, CrudOperationOptions } from './types';
import type { DataEntityWithFields } from '@/model/data-entity';
import { BASE_OPERATIONS } from './base-operations';
import { EXTENDED_OPERATIONS } from './extended-operations';
import { generateRelationshipOperations } from './generate-relationship-ops';

/**
 * Get complete CRUD operations catalog for an entity
 * 
 * This function orchestrates the generation of all CRUD operations by combining:
 * 1. Base operations (always included)
 * 2. Extended operations (opt-in via options)
 * 3. Relationship operations (auto-generated from FK fields)
 * 4. Custom operations (user-defined)
 * 
 * @param entity - The entity to generate operations for
 * @param allEntities - All entities (needed to resolve FK relationships)
 * @param options - Configuration for which operations to include
 * @returns Complete array of CRUD operations for this entity
 * 
 * @example
 * ```typescript
 * const operations = getCrudOperationsForEntity(userEntity, allEntities, {
 *   includeExtended: true,
 *   includeRelationships: true,
 * });
 * // Returns: getAll, getById, create, update, delete, 
 * //          getAllPaginated, search, count, bulkCreate, bulkUpdate, bulkDelete,
 * //          getByRoleId (if user has role_id FK)
 * ```
 */
export const getCrudOperationsForEntity = (
  entity: DataEntityWithFields,
  allEntities: DataEntityWithFields[],
  options: CrudOperationOptions = {}
): CrudOperation[] => {
  const ops: CrudOperation[] = [];

  // 1. Base operations (always included)
  ops.push(...BASE_OPERATIONS);

  // 2. Extended operations (opt-in)
  if (options.includeExtended) {
    ops.push(...EXTENDED_OPERATIONS);
  }

  // 3. Relationship operations (auto-generated from FK fields)
  if (options.includeRelationships !== false) {
    const relationshipOps = generateRelationshipOperations(entity, allEntities);
    ops.push(...relationshipOps);
  }

  // 4. Custom operations (user-defined)
  if (options.customOperations && options.customOperations.length > 0) {
    ops.push(...options.customOperations);
  }

  return ops;
};
