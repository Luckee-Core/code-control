'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProposalWarning, ProposedColumn, ProposedTable } from '@/model/data-model-proposal';
import { useAppSelector } from '@/store';

type TableCardProps = {
  table: ProposedTable;
  warnings: ProposalWarning[];
};

const ON_DELETE_LABEL: Record<ProposedColumn['on_delete'], string> = {
  none: '',
  cascade: 'cascade',
  set_null: 'set null',
  restrict: 'restrict',
};

export const TableCard = ({ table, warnings }: TableCardProps) => {
  const standardColumns = useAppSelector((state) => state.conventionsCatalog.standard_columns);
  const standardNames =
    standardColumns.length > 0 ? standardColumns.map((column) => column.name) : ['id', 'created_at', 'updated_at'];

  const columnWarnings = (column: string) => warnings.filter((warning) => warning.column === column);
  const tableWarnings = warnings.filter((warning) => !warning.column);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h3 className={styles.tableName}>{table.name}</h3>
            <span className={styles.tag}>{table.archetype}</span>
            <span className={styles.tag}>{table.lifecycle}</span>
            {warnings.length > 0 ? <span className={styles.warnTag}>{warnings.length} findings</span> : null}
          </div>
          <p className={styles.entity}>src/model/{table.entity}/index.ts</p>
          {table.purpose ? <p className={styles.purpose}>{table.purpose}</p> : null}
          {table.why_needed ? (
            <p className={styles.why}>
              <span className={styles.whyLabel}>Why needed: </span>
              {table.why_needed}
            </p>
          ) : null}
          {tableWarnings.map((warning, index) => (
            <p key={index} className={warning.severity === 'error' ? styles.inlineError : styles.inlineWarning}>
              {warning.message} ({warning.convention_key})
            </p>
          ))}
        </div>
      </div>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Column</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Null</th>
              <th className={styles.th}>Default</th>
              <th className={styles.th}>References</th>
              <th className={styles.th}>Flags</th>
              <th className={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.standardRow}>
              <td className={`${styles.td} ${styles.mono}`} colSpan={7}>
                {standardNames.join(' · ')} — added to every table automatically
              </td>
            </tr>
            {table.columns.map((column) => {
              const findings = columnWarnings(column.name);
              return (
                <tr key={column.name} className={styles.row}>
                  <td className={`${styles.td} ${styles.mono} ${styles.colName}`}>
                    {column.name}
                    {findings.map((warning, index) => (
                      <div
                        key={index}
                        className={warning.severity === 'error' ? styles.inlineError : styles.inlineWarning}
                      >
                        {warning.message}
                      </div>
                    ))}
                  </td>
                  <td className={`${styles.td} ${styles.mono}`}>
                    {column.type}
                    {column.enum_values.length > 0 ? (
                      <div className={styles.enumValues}>{column.enum_values.join(' | ')}</div>
                    ) : null}
                  </td>
                  <td className={styles.td}>{column.nullable ? 'yes' : 'no'}</td>
                  <td className={`${styles.td} ${styles.mono}`}>{column.default_sql || '—'}</td>
                  <td className={`${styles.td} ${styles.mono}`}>
                    {column.references_table ? (
                      <>
                        {column.references_table}
                        <div className={styles.muted}>on delete {ON_DELETE_LABEL[column.on_delete] || '—'}</div>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className={styles.td}>
                    {[column.is_unique ? 'unique' : '', column.is_indexed ? 'indexed' : ''].filter(Boolean).join(', ') ||
                      '—'}
                  </td>
                  <td className={`${styles.td} ${styles.description}`}>{column.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const styles = {
  titleBlock: `min-w-0 flex flex-col gap-1`,
  titleRow: `flex flex-wrap items-center gap-2`,
  tableName: `text-sm font-semibold text-gray-900 font-mono`,
  tag: `text-[10px] font-medium text-gray-600 bg-white border border-gray-300 rounded px-1.5 py-0.5 font-mono`,
  warnTag: `text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5`,
  entity: `text-[11px] text-gray-500 font-mono`,
  purpose: `text-xs text-gray-800`,
  why: `text-xs text-gray-600`,
  whyLabel: `font-semibold text-gray-700`,
  scroll: `overflow-x-auto`,
  table: `w-full text-xs border-collapse`,
  th: `
    text-left px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500
    border-b border-gray-200 bg-white whitespace-nowrap
  `,
  row: `border-b border-gray-100 align-top`,
  standardRow: `border-b border-gray-100 bg-gray-50/60 text-gray-400`,
  td: `px-3 py-1.5 text-gray-800`,
  mono: `font-mono`,
  colName: `font-medium text-gray-900 whitespace-nowrap`,
  enumValues: `text-[10px] text-gray-500 mt-0.5 whitespace-normal`,
  muted: `text-[10px] text-gray-500`,
  description: `text-gray-600 min-w-[14rem]`,
  inlineError: `text-[10px] text-red-700 mt-0.5 font-sans whitespace-normal`,
  inlineWarning: `text-[10px] text-amber-700 mt-0.5 font-sans whitespace-normal`,
};
