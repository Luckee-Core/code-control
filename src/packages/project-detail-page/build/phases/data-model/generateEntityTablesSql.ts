import type { DataEntityWithFields } from '@/model/data-entity';

/**
 * Map TypeScript/generic types to PostgreSQL types
 */
const mapTypeToPostgres = (type: string): string => {
  const typeMap: Record<string, string> = {
    string: 'text',
    number: 'integer',
    bigint: 'bigint',
    float: 'numeric',
    decimal: 'numeric',
    boolean: 'boolean',
    date: 'date',
    datetime: 'timestamp with time zone',
    timestamp: 'timestamp with time zone',
    uuid: 'uuid',
    json: 'jsonb',
    text: 'text',
    email: 'text',
    url: 'text',
    phone: 'text',
  };

  const normalizedType = type.toLowerCase().trim();
  return typeMap[normalizedType] || 'text';
};

/**
 * Generate CREATE TABLE SQL for a single entity
 */
export const generateEntityTableSql = (entity: DataEntityWithFields): string => {
  const tableName = entity.table_name || entity.name.toLowerCase().replace(/\s+/g, '_');
  const fields = entity.fields || [];

  let sql = `-- =============================================================================\n`;
  sql += `-- Table: ${tableName}\n`;
  if (entity.description) {
    sql += `-- ${entity.description}\n`;
  }
  sql += `-- =============================================================================\n`;
  sql += `CREATE TABLE IF NOT EXISTS public.${tableName} (\n`;

  // Filter out standard columns that we'll add ourselves
  const standardColumns = ['id', 'created_at', 'updated_at'];
  const userFields = [...fields]
    .filter((f) => !standardColumns.includes(f.name.toLowerCase()))
    .sort((a, b) => a.sort_order - b.sort_order);

  // ID column (always first)
  sql += `    id uuid NOT NULL DEFAULT gen_random_uuid(),\n`;

  // User-defined fields (excluding standard columns)
  userFields.forEach((field) => {
    const columnName = field.name.toLowerCase().replace(/\s+/g, '_');
    const pgType = mapTypeToPostgres(field.type);
    const nullable = field.nullable ? '' : ' NOT NULL';
    const defaultValue = field.default_value ? ` DEFAULT ${field.default_value}` : '';

    sql += `    ${columnName} ${pgType}${nullable}${defaultValue},\n`;
  });

  // Timestamps (always last before constraints)
  sql += `    created_at timestamp with time zone NOT NULL DEFAULT now(),\n`;
  sql += `    updated_at timestamp with time zone NOT NULL DEFAULT now(),\n`;

  // Primary key constraint
  sql += `    \n`;
  sql += `    CONSTRAINT ${tableName}_pkey PRIMARY KEY (id)\n`;
  sql += `);\n\n`;

  // Foreign key constraints (if any references exist)
  const foreignKeyFields = fields.filter((f) => f.references_entity_id);
  if (foreignKeyFields.length > 0) {
    sql += `-- Foreign key constraints\n`;
    foreignKeyFields.forEach((field) => {
      const columnName = field.name.toLowerCase().replace(/\s+/g, '_');
      // Note: We'd need to look up the referenced table name from references_entity_id
      // For now, assume it's the entity name pattern
      sql += `-- ALTER TABLE public.${tableName} ADD CONSTRAINT ${tableName}_${columnName}_fkey\n`;
      sql += `--   FOREIGN KEY (${columnName}) REFERENCES public.{referenced_table}(id);\n`;
    });
    sql += `\n`;
  }

  // Indexes
  sql += `-- Indexes\n`;
  fields
    .filter((f) => f.name.toLowerCase().includes('email') || f.name.toLowerCase().includes('_id'))
    .forEach((field) => {
      const columnName = field.name.toLowerCase().replace(/\s+/g, '_');
      sql += `CREATE INDEX IF NOT EXISTS idx_${tableName}_${columnName} ON public.${tableName}(${columnName});\n`;
    });
  sql += `\n`;

  // Table comment
  sql += `COMMENT ON TABLE public.${tableName} IS '${entity.description || entity.name}';\n\n`;

  return sql;
};

/**
 * Generate SQL for multiple entities
 */
export const generateEntityTablesSql = (entities: DataEntityWithFields[]): string => {
  if (entities.length === 0) {
    return '-- No entities selected';
  }

  let sql = `-- =============================================================================\n`;
  sql += `-- Data Model SQL Migration\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Entities: ${entities.map((e) => e.name).join(', ')}\n`;
  sql += `-- =============================================================================\n\n`;

  // Generate table for each entity
  entities.forEach((entity) => {
    sql += generateEntityTableSql(entity);
  });

  sql += `-- =============================================================================\n`;
  sql += `-- Migration Complete\n`;
  sql += `-- =============================================================================\n`;

  return sql;
};
