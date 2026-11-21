import type { ProposedTable } from '@/model/data-model-proposal';

/** What the detail pages PR generates for one table, as shown in the Detail pages tab. */
export type DetailPlanRow = {
  table: string;
  route: string;
  /** Pure link table: no detail page. */
  isJoin: boolean;
  /** Fields the edit modal changes. */
  editable: number;
  /** Related-data tab labels. */
  tabs: string[];
};

const isReference = (type: string, references: string) => Boolean(references) || type === 'uuid';
const humanize = (name: string) => {
  const text = name.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const isJoinTable = (table: ProposedTable) =>
  table.columns.filter((column) => isReference(column.type, column.references_table)).length >= 2 &&
  table.columns.every((column) => isReference(column.type, column.references_table) || column.name === 'sort_order');

/**
 * Mirrors Code Control's detail view rules for the approved tables: tabs for tables with a foreign
 * key to this one, and the other side of link tables. Lifecycle columns are added by codegen.
 */
export const buildDetailPlan = (tables: ProposedTable[]): DetailPlanRow[] =>
  tables.map((table) => {
    const tabs: string[] = [];
    for (const other of tables) {
      const pointing = other.columns.filter((column) => column.references_table === table.name);
      if (pointing.length === 0) continue;
      if (isJoinTable(other)) {
        for (const column of other.columns) {
          if (column.references_table && !pointing.includes(column)) tabs.push(`${humanize(column.references_table)} (via ${other.name})`);
        }
        continue;
      }
      for (const column of pointing) tabs.push(pointing.length > 1 ? `${humanize(other.name)} (${column.name})` : humanize(other.name));
    }
    return {
      table: table.name,
      route: `/${table.entity}-detail-page`,
      isJoin: isJoinTable(table),
      editable: table.columns.filter((column) => !['jsonb', 'text_array'].includes(column.type) && !(column.type === 'uuid' && !column.references_table)).length,
      tabs,
    };
  });
