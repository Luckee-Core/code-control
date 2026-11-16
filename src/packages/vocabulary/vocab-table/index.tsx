'use client';

import { detailPageStyles } from '@/components/detail-page-styles';

export type VocabColumn<T> = {
  label: string;
  render: (row: T) => string;
  mono?: boolean;
};

type VocabTableProps<T> = {
  title: string;
  subtitle: string;
  rows: T[];
  rowKey: (row: T) => string;
  columns: VocabColumn<T>[];
};

export const VocabTable = <T,>({ title, subtitle, rows, rowKey, columns }: VocabTableProps<T>) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <div>
        <h2 className={detailPageStyles.panelTitle}>
          {title} ({rows.length})
        </h2>
        <p className={detailPageStyles.panelSubtitle}>{subtitle}</p>
      </div>
    </div>
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label} className={styles.th}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.label} className={column.mono ? styles.mono : styles.cell}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const styles = {
  scroll: `overflow-x-auto`,
  table: `w-full border-collapse text-xs`,
  th: `px-3 py-2 text-left bg-gray-100 border-b border-gray-300 text-[10px] font-semibold text-gray-600 uppercase tracking-wide`,
  cell: `px-3 py-2 text-xs text-gray-900 border-b border-gray-200 align-top`,
  mono: `px-3 py-2 text-[11px] font-mono text-gray-700 border-b border-gray-200 align-top whitespace-nowrap`,
};
