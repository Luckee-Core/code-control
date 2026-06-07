/**
 * CRUD Operation Types
 * 
 * Type definitions for the enhanced CRUD operations system.
 */

export type CrudOperationCategory = 'base' | 'extended' | 'relationship' | 'custom';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * Represents a single CRUD operation for an entity
 */
export type CrudOperation = {
  /** Unique operation key (e.g., 'getAll', 'getByAssigneeId') */
  key: string;
  
  /** Human-readable label (e.g., 'Get All', 'Get By Assignee') */
  label: string;
  
  /** HTTP method for this operation */
  method: HttpMethod;
  
  /** URL pattern (e.g., '/', '/:id', '/assignee/:assigneeId') */
  urlPattern: string;
  
  /** Human-readable description */
  description: string;
  
  /** Category of this operation */
  category: CrudOperationCategory;
  
  /** If this operation was generated from a FK field, includes metadata */
  generatedFrom?: {
    /** Field name (e.g., 'assignee_id') */
    fieldName: string;
    
    /** Referenced entity name (e.g., 'User') */
    referencedEntity: string;
  };
};

/**
 * Options for configuring which operations to include
 */
export type CrudOperationOptions = {
  /** Include extended operations (pagination, search, bulk, count) */
  includeExtended?: boolean;
  
  /** Include relationship operations (auto-generated from FK fields) */
  includeRelationships?: boolean;
  
  /** Additional custom operations defined by the user */
  customOperations?: CrudOperation[];
};
