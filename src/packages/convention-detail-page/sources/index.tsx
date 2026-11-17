'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { deleteConventionSourceThunk } from '@/store/thunks/conventions';
import { SourceForm } from './form';

export const Sources = () => {
  const dispatch = useAppDispatch();
  const sources = useAppSelector((state) => state.conventionSources);
  const builder = useAppSelector((state) => state.conventionsBuilder);

  const sorted = useMemo(
    () => Object.values(sources).sort((a, b) => a.repo.localeCompare(b.repo) || a.adr_path.localeCompare(b.adr_path)),
    [sources],
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this source?')) {
      void dispatch(deleteConventionSourceThunk(id));
    }
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h3 className={detailPageStyles.panelTitle}>Sources</h3>
          <p className={detailPageStyles.panelSubtitle}>
            Where this rule comes from (paths relative to ~/github). Copies/versions show ADR drift.
          </p>
        </div>
        {!builder.isSourceFormOpen ? (
          <button
            type="button"
            onClick={() => dispatch(ConventionsBuilderActions.openSourceForm())}
            className={detailPageStyles.secondaryButton}
          >
            Add source
          </button>
        ) : null}
      </div>
      <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
        {builder.isSourceFormOpen ? <SourceForm /> : null}
        {!builder.isLoadingDetail && sorted.length === 0 && !builder.isSourceFormOpen ? (
          <p className={styles.muted}>No sources yet.</p>
        ) : null}
        {sorted.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Repo</th>
                <th className={styles.th}>Path</th>
                <th className={styles.th}>Excerpt</th>
                <th className={styles.th}>Copies / versions</th>
                <th className={styles.th} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((source) => (
                <tr key={source.id} className={styles.row}>
                  <td className={styles.cell}>{source.repo}</td>
                  <td className={`${styles.cell} ${styles.mono}`}>{source.adr_path}</td>
                  <td className={styles.cellMuted}>{source.excerpt || '—'}</td>
                  <td className={styles.cellMuted}>
                    {source.copy_count !== null ? `${source.copy_count} / ${source.variant_count ?? '?'}` : '—'}
                  </td>
                  <td className={styles.cell}>
                    <button type="button" onClick={() => handleDelete(source.id)} className={styles.deleteButton}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  body: `flex flex-col gap-3 overflow-x-auto`,
  muted: `text-xs text-gray-500`,
  table: `w-full border-collapse text-xs`,
  th: `
    px-2 py-1.5 text-left border-b border-gray-300 text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  row: `align-top`,
  cell: `px-2 py-1.5 border-b border-gray-200 text-gray-900`,
  cellMuted: `px-2 py-1.5 border-b border-gray-200 text-gray-600`,
  mono: `font-mono text-[11px] break-all`,
  deleteButton: `text-[11px] text-gray-500 hover:text-red-700 bg-transparent border-none cursor-pointer`,
};
