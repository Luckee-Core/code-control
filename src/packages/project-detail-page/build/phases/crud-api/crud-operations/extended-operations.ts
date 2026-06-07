/**
 * Extended CRUD Operations
 * 
 * Additional operations that are opt-in via CrudOperationOptions.
 * These provide advanced functionality like pagination, search, and bulk operations.
 */

import type { CrudOperation } from './types';

/**
 * Extended CRUD operations (opt-in)
 * 
 * These operations provide additional functionality beyond basic CRUD:
 * - Pagination for large datasets
 * - Search/filtering capabilities
 * - Counting records
 * - Bulk create/update/delete operations
 */
export const EXTENDED_OPERATIONS: CrudOperation[] = [
  {
    key: 'get-all-paginated',
    label: 'Get All (Paginated)',
    method: 'GET',
    urlPattern: '/?page=1&limit=20',
    description: 'Get entities with pagination support',
    category: 'extended',
  },
  {
    key: 'search',
    label: 'Search',
    method: 'GET',
    urlPattern: '/search?q=term',
    description: 'Search entities by query term',
    category: 'extended',
  },
  {
    key: 'count',
    label: 'Count',
    method: 'GET',
    urlPattern: '/count',
    description: 'Count total entities (with optional filters)',
    category: 'extended',
  },
  {
    key: 'bulk-create',
    label: 'Bulk Create',
    method: 'POST',
    urlPattern: '/bulk',
    description: 'Create multiple entities at once',
    category: 'extended',
  },
  {
    key: 'bulk-update',
    label: 'Bulk Update',
    method: 'PATCH',
    urlPattern: '/bulk',
    description: 'Update multiple entities at once',
    category: 'extended',
  },
  {
    key: 'bulk-delete',
    label: 'Bulk Delete',
    method: 'DELETE',
    urlPattern: '/bulk',
    description: 'Delete multiple entities at once',
    category: 'extended',
  },
];
