import type { ProposedTable } from '@/model/data-model-proposal';

/** What the dashboard PR shows for one table, as listed in the Dashboard tab. */
export type DashboardPlanRow = {
  table: string;
  /** Pure link table: no card. */
  isJoin: boolean;
  /** The card splits active vs archived rows (is_active lifecycle). */
  activeSplit: boolean;
  /** Enum column whose values the card counts ('' when none). */
  breakdown: string;
};

const isReference = (type: string, references: string) => Boolean(references) || type === 'uuid';
const isJoinTable = (table: ProposedTable) =>
  table.columns.filter((column) => isReference(column.type, column.references_table)).length >= 2 &&
  table.columns.every((column) => isReference(column.type, column.references_table) || column.name === 'sort_order');

/**
 * Mirrors the dashboard template for the approved tables: one card per non-join table, an
 * active split for is_active tables and a breakdown by the first enum column.
 */
export const buildDashboardPlan = (tables: ProposedTable[]): DashboardPlanRow[] =>
  tables.map((table) => ({
    table: table.name,
    isJoin: isJoinTable(table),
    activeSplit: table.lifecycle === 'is_active' || table.columns.some((column) => column.name === 'is_active'),
    breakdown: table.columns.find((column) => column.type === 'enum')?.name ?? '',
  }));
