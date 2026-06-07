/**
 * Base CRUD Operations
 * 
 * The 5 standard CRUD operations that are always available for every entity.
 */

import type { CrudOperation } from './types';

/**
 * Base CRUD operations available for all entities
 * 
 * These operations are always included and provide the standard
 * Create, Read, Update, Delete functionality.
 */
export const BASE_OPERATIONS: CrudOperation[] = [
  {
    key: 'get-all',
    label: 'Get All',
    method: 'GET',
    urlPattern: '/',
    description: 'Get all entities',
    category: 'base',
  },
  {
    key: 'get-by-id',
    label: 'Get By ID',
    method: 'GET',
    urlPattern: '/:id',
    description: 'Get single entity by ID',
    category: 'base',
  },
  {
    key: 'create',
    label: 'Create',
    method: 'POST',
    urlPattern: '/',
    description: 'Create new entity',
    category: 'base',
  },
  {
    key: 'update',
    label: 'Update',
    method: 'PATCH',
    urlPattern: '/:id',
    description: 'Update existing entity',
    category: 'base',
  },
  {
    key: 'delete',
    label: 'Delete',
    method: 'DELETE',
    urlPattern: '/:id',
    description: 'Delete entity',
    category: 'base',
  },
];
