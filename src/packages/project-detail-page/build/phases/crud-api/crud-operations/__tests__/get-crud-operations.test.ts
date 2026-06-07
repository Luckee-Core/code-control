/**
 * Unit Tests for getCrudOperationsForEntity
 * 
 * Tests the CRUD operations generation logic
 */

import { getCrudOperationsForEntity } from '../get-crud-operations';
import { BASE_OPERATIONS } from '../base-operations';
import { EXTENDED_OPERATIONS } from '../extended-operations';
import type { DataEntityWithFields } from '@/model/data-entity';

describe('getCrudOperationsForEntity', () => {
  // Mock entities for testing
  const userEntity: DataEntityWithFields = {
    id: 'user-id',
    project_id: 'project-id',
    name: 'User',
    table_name: 'users',
    description: 'User entity',
    sort_order: 0,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    fields: [
      {
        id: 'field-1',
        entity_id: 'user-id',
        name: 'id',
        type: 'UUID',
        nullable: false,
        default_value: null,
        sort_order: 0,
        references_entity_id: null,
        created_at: '2026-03-01T00:00:00Z',
        updated_at: '2026-03-01T00:00:00Z',
      },
      {
        id: 'field-2',
        entity_id: 'user-id',
        name: 'role_id',
        type: 'UUID',
        nullable: false,
        default_value: null,
        sort_order: 1,
        references_entity_id: 'role-id',
        created_at: '2026-03-01T00:00:00Z',
        updated_at: '2026-03-01T00:00:00Z',
      },
    ],
  };

  const roleEntity: DataEntityWithFields = {
    id: 'role-id',
    project_id: 'project-id',
    name: 'Role',
    table_name: 'roles',
    description: 'Role entity',
    sort_order: 1,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    fields: [],
  };

  const allEntities = [userEntity, roleEntity];

  it('should include base operations by default', () => {
    const operations = getCrudOperationsForEntity(userEntity, allEntities);
    
    expect(operations.length).toBeGreaterThanOrEqual(BASE_OPERATIONS.length);
    
    const operationKeys = operations.map(op => op.key);
    expect(operationKeys).toContain('getAll');
    expect(operationKeys).toContain('getById');
    expect(operationKeys).toContain('create');
    expect(operationKeys).toContain('update');
    expect(operationKeys).toContain('delete');
  });

  it('should include extended operations when enabled', () => {
    const operations = getCrudOperationsForEntity(userEntity, allEntities, {
      includeExtended: true,
    });
    
    const operationKeys = operations.map(op => op.key);
    expect(operationKeys).toContain('getAllPaginated');
    expect(operationKeys).toContain('search');
    expect(operationKeys).toContain('count');
    expect(operationKeys).toContain('bulkCreate');
    expect(operationKeys).toContain('bulkUpdate');
    expect(operationKeys).toContain('bulkDelete');
  });

  it('should NOT include extended operations when not enabled', () => {
    const operations = getCrudOperationsForEntity(userEntity, allEntities, {
      includeExtended: false,
    });
    
    const operationKeys = operations.map(op => op.key);
    expect(operationKeys).not.toContain('getAllPaginated');
    expect(operationKeys).not.toContain('search');
  });

  it('should generate relationship operations from FK fields', () => {
    const operations = getCrudOperationsForEntity(userEntity, allEntities, {
      includeRelationships: true,
    });
    
    const operationKeys = operations.map(op => op.key);
    expect(operationKeys).toContain('getByRoleId');
    
    const relationshipOp = operations.find(op => op.key === 'getByRoleId');
    expect(relationshipOp).toBeDefined();
    expect(relationshipOp?.category).toBe('relationship');
    expect(relationshipOp?.generatedFrom).toEqual({
      fieldName: 'role_id',
      referencedEntity: 'Role',
    });
  });

  it('should NOT include relationship operations when disabled', () => {
    const operations = getCrudOperationsForEntity(userEntity, allEntities, {
      includeRelationships: false,
    });
    
    const operationKeys = operations.map(op => op.key);
    expect(operationKeys).not.toContain('getByRoleId');
  });

  it('should include custom operations when provided', () => {
    const customOp = {
      key: 'getActiveUsers',
      label: 'Get Active Users',
      method: 'GET' as const,
      urlPattern: '/active',
      description: 'Get all active users',
      category: 'custom' as const,
    };

    const operations = getCrudOperationsForEntity(userEntity, allEntities, {
      customOperations: [customOp],
    });
    
    const operationKeys = operations.map(op => op.key);
    expect(operationKeys).toContain('getActiveUsers');
  });

  it('should return operations with all required metadata', () => {
    const operations = getCrudOperationsForEntity(userEntity, allEntities);
    
    operations.forEach(op => {
      expect(op.key).toBeDefined();
      expect(op.label).toBeDefined();
      expect(op.method).toBeDefined();
      expect(op.urlPattern).toBeDefined();
      expect(op.description).toBeDefined();
      expect(op.category).toBeDefined();
      expect(['GET', 'POST', 'PATCH', 'DELETE']).toContain(op.method);
      expect(['base', 'extended', 'relationship', 'custom']).toContain(op.category);
    });
  });

  it('should have unique operation keys', () => {
    const operations = getCrudOperationsForEntity(userEntity, allEntities, {
      includeExtended: true,
      includeRelationships: true,
    });
    
    const keys = operations.map(op => op.key);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it('should handle entity with no FK fields', () => {
    const operations = getCrudOperationsForEntity(roleEntity, allEntities, {
      includeRelationships: true,
    });
    
    // Should still have base operations
    expect(operations.length).toBeGreaterThanOrEqual(BASE_OPERATIONS.length);
    
    // Should not have any relationship operations
    const relationshipOps = operations.filter(op => op.category === 'relationship');
    expect(relationshipOps.length).toBe(0);
  });
});
