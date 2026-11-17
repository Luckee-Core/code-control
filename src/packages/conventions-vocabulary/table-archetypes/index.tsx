'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';
import { vocabularyTableStyles as t } from '../vocabulary-table-styles';

export const TableArchetypes = () => {
  const archetypes = useAppSelector((state) => state.conventionsCatalog.table_archetypes);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Table archetypes</h2>
          <p className={detailPageStyles.panelSubtitle}>Recurring table shapes across Luckee projects.</p>
        </div>
      </div>
      <div className={t.body}>
        <table className={t.table}>
          <thead>
            <tr>
              <th className={t.th}>Archetype</th>
              <th className={t.th}>Naming</th>
              <th className={t.th}>When to use</th>
              <th className={t.th}>Required columns</th>
              <th className={t.th}>Examples</th>
            </tr>
          </thead>
          <tbody>
            {archetypes.map((archetype) => (
              <tr key={archetype.key} className={t.row}>
                <td className={t.cell}>
                  <div className="font-medium">{archetype.name}</div>
                  <div className={`${t.cellMuted} ${t.mono} px-0 border-none`}>{archetype.key}</div>
                  <div className="mt-1 text-gray-600">{archetype.description}</div>
                </td>
                <td className={`${t.cellMuted} ${t.mono}`}>{archetype.naming_pattern}</td>
                <td className={t.cellMuted}>{archetype.when_to_use}</td>
                <td className={t.cellMuted}>
                  <pre className={`${t.mono} whitespace-pre-wrap`}>
                    {archetype.required_columns.length > 0
                      ? JSON.stringify(archetype.required_columns, null, 1)
                      : '— standard columns only'}
                  </pre>
                </td>
                <td className={`${t.cellMuted} ${t.mono}`}>{archetype.example_tables.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
