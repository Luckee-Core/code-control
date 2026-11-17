'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { deleteConventionExampleThunk } from '@/store/thunks/conventions';
import { ExampleForm } from './form';

export const Examples = () => {
  const dispatch = useAppDispatch();
  const examples = useAppSelector((state) => state.conventionExamples);
  const builder = useAppSelector((state) => state.conventionsBuilder);

  const sorted = useMemo(
    () =>
      Object.values(examples).sort(
        (a, b) => a.kind.localeCompare(b.kind) || a.sort_order - b.sort_order || a.title.localeCompare(b.title),
      ),
    [examples],
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete example "${title}"?`)) {
      void dispatch(deleteConventionExampleThunk(id));
    }
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h3 className={detailPageStyles.panelTitle}>Examples</h3>
          <p className={detailPageStyles.panelSubtitle}>Shown to the AI as ✅ correct / ❌ incorrect code.</p>
        </div>
        {!builder.isExampleFormOpen ? (
          <button
            type="button"
            onClick={() => dispatch(ConventionsBuilderActions.openExampleForm())}
            className={detailPageStyles.secondaryButton}
          >
            Add example
          </button>
        ) : null}
      </div>
      <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
        {builder.isExampleFormOpen ? <ExampleForm /> : null}
        {builder.isLoadingDetail ? <p className={styles.muted}>Loading…</p> : null}
        {!builder.isLoadingDetail && sorted.length === 0 && !builder.isExampleFormOpen ? (
          <p className={styles.muted}>No examples yet.</p>
        ) : null}
        {sorted.map((example) => (
          <div key={example.id} className={styles.example}>
            <div className={styles.exampleHeader}>
              <span className={example.kind === 'correct' ? styles.correct : styles.incorrect}>
                {example.kind === 'correct' ? '✅ Correct' : '❌ Incorrect'}
              </span>
              <span className={styles.exampleTitle}>{example.title}</span>
              {example.path_hint ? <span className={styles.path}>{example.path_hint}</span> : null}
              <button
                type="button"
                onClick={() => handleDelete(example.id, example.title)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
            <pre className={styles.code}>{example.code}</pre>
            {example.note ? <p className={styles.note}>{example.note}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  body: `flex flex-col gap-4`,
  muted: `text-xs text-gray-500`,
  example: `flex flex-col gap-1.5`,
  exampleHeader: `flex items-center gap-2 flex-wrap`,
  correct: `text-xs font-semibold text-green-700`,
  incorrect: `text-xs font-semibold text-red-700`,
  exampleTitle: `text-xs font-medium text-gray-900`,
  path: `font-mono text-[10px] text-gray-500`,
  deleteButton: `
    ml-auto text-[11px] text-gray-500 hover:text-red-700 bg-transparent border-none cursor-pointer
  `,
  code: `
    text-[11px] font-mono bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto text-gray-800
    whitespace-pre
  `,
  note: `text-xs text-gray-600`,
};
