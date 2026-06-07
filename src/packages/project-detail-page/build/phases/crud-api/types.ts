/**
 * Types for CRUD API Phase
 */

import type { CrudOperation } from './crud-operations';

/**
 * Entity with full CRUD operations catalog
 */
export type EntityWithOperations = {
  id: string;
  name: string;
  table_name: string | null;
  description: string | null | undefined;
  operations: CrudOperation[];
  /** Grouped operations by category */
  operationsByCategory: {
    base: CrudOperation[];
    extended: CrudOperation[];
    relationship: CrudOperation[];
    custom: CrudOperation[];
  };
};

/**
 * Queue status for an entity
 */
export type EntityQueueStatus = {
  entityId: string;
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  queueItemId?: string;
  prLink?: string | null;
  error?: string | null;
};
