export const FIELD_TYPES = [
  'text',
  'uuid',
  'integer',
  'bigint',
  'boolean',
  'timestamp',
  'timestamptz',
  'date',
  'jsonb',
  'decimal',
  'numeric',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];
