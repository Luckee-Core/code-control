/**
 * CRUD Operations - Barrel Exports
 * 
 * Central export point for all CRUD operations functionality.
 */

export { getCrudOperationsForEntity } from './get-crud-operations';
export { BASE_OPERATIONS } from './base-operations';
export { EXTENDED_OPERATIONS } from './extended-operations';
export { generateRelationshipOperations } from './generate-relationship-ops';

export type {
  CrudOperation,
  CrudOperationOptions,
  CrudOperationCategory,
  HttpMethod,
} from './types';
