'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';
import { vocabularyTableStyles as t } from '../vocabulary-table-styles';

export const StandardColumns = () => {
  const columns = useAppSelector((state) => state.conventionsCatalog.standard_columns);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Standard columns</h2>
          <p className={detailPageStyles.panelSubtitle}>Added to every table by the generators; the AI never lists them.</p>
        </div>
      </div>
      <div className={t.body}>
        <table className={t.table}>
          <thead>
            <tr>
              <th className={t.th}>Column</th>
              <th className={t.th}>Definition</th>
              <th className={t.th}>TypeScript</th>
              <th className={t.th}>Set by</th>
              <th className={t.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((column) => (
              <tr key={column.name} className={t.row}>
                <td className={`${t.cell} ${t.mono}`}>{column.name}</td>
                <td className={`${t.cell} ${t.mono}`}>{column.sql_definition}</td>
                <td className={`${t.cellMuted} ${t.mono}`}>{column.ts_type}</td>
                <td className={t.cellMuted}>{column.set_by}</td>
                <td className={t.cellMuted}>{column.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
