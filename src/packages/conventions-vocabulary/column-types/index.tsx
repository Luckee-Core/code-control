'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';
import { vocabularyTableStyles as t } from '../vocabulary-table-styles';

export const ColumnTypes = () => {
  const types = useAppSelector((state) => state.conventionsCatalog.column_types);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Column types</h2>
          <p className={detailPageStyles.panelSubtitle}>The only types a proposed column may use.</p>
        </div>
      </div>
      <div className={t.body}>
        <table className={t.table}>
          <thead>
            <tr>
              <th className={t.th}>Type</th>
              <th className={t.th}>SQL</th>
              <th className={t.th}>TypeScript</th>
              <th className={t.th}>Use when</th>
              <th className={t.th}>Avoid when</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.key} className={t.row}>
                <td className={t.cell}>
                  <div className={t.mono}>{type.key}</div>
                  {!type.is_active ? <div className={t.cellMuted}>inactive</div> : null}
                </td>
                <td className={`${t.cell} ${t.mono}`}>{type.sql_type}</td>
                <td className={`${t.cellMuted} ${t.mono}`}>{type.ts_type}</td>
                <td className={t.cellMuted}>{type.when_to_use}</td>
                <td className={t.cellMuted}>{type.avoid_when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
