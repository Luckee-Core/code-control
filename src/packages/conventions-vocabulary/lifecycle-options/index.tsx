'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';
import { vocabularyTableStyles as t } from '../vocabulary-table-styles';

export const LifecycleOptions = () => {
  const options = useAppSelector((state) => state.conventionsCatalog.lifecycle_options);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Lifecycle options</h2>
          <p className={detailPageStyles.panelSubtitle}>Each table picks one; apps may mix them.</p>
        </div>
      </div>
      <div className={t.body}>
        <table className={t.table}>
          <thead>
            <tr>
              <th className={t.th}>Lifecycle</th>
              <th className={t.th}>Columns</th>
              <th className={t.th}>Read filter</th>
              <th className={t.th}>When to use</th>
            </tr>
          </thead>
          <tbody>
            {options.map((option) => (
              <tr key={option.key} className={t.row}>
                <td className={t.cell}>
                  <div className={t.mono}>{option.key}</div>
                  <div className={t.cellMuted}>{option.name}</div>
                </td>
                <td className={`${t.cell} ${t.mono}`}>{option.columns_sql || '—'}</td>
                <td className={`${t.cellMuted} ${t.mono}`}>{option.read_filter || '—'}</td>
                <td className={t.cellMuted}>{option.when_to_use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
