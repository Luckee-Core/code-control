import type { ProposedTable } from '@/model/data-model-proposal';

/** What the list-pages PR generates for one table, as shown in the Tables tab. */
export type ListPlanRow = {
  table: string;
  route: string;
  /** Pure link table: no list page. */
  isJoin: boolean;
  search: string[];
  filters: string[];
};

/**
 * Mirrors Code Control's list view rules for the approved tables: join tables (own columns only
 * foreign keys, plus sort_order) are skipped; text columns are searched; enum and boolean columns
 * get a filter. Lifecycle columns (e.g. is_active) are added by codegen and not listed here.
 */
export const buildListPlan = (tables: ProposedTable[]): ListPlanRow[] =>
  tables.map((table) => {
    const isReference = (type: string, references: string) => Boolean(references) || type === 'uuid';
    const references = table.columns.filter((column) => isReference(column.type, column.references_table)).length;
    const isJoin =
      references >= 2 &&
      table.columns.every((column) => isReference(column.type, column.references_table) || column.name === 'sort_order');
    return {
      table: table.name,
      route: `/${table.name.replace(/_/g, '-')}`,
      isJoin,
      search: table.columns.filter((column) => column.type === 'text' && column.enum_values.length === 0).map((column) => column.name),
      filters: table.columns
        .filter((column) => column.type === 'enum' || column.enum_values.length > 0 || column.type === 'boolean')
        .map((column) => column.name),
    };
  });
