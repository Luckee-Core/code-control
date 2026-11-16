'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionBuilderActions } from '@/store/builders';
import { createConventionExampleThunk, deleteConventionExampleThunk } from '@/store/thunks/conventions';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formFieldStyles } from '@/components/form-field-styles';
import type { ConventionExampleKind, ConventionExampleLanguage } from '@/model/convention-example';
import { EXAMPLE_KINDS, EXAMPLE_LANGUAGES } from '@/packages/conventions/convention-enums';

export const Examples = () => {
  const dispatch = useAppDispatch();
  const examples = useAppSelector((state) => state.currentConvention.examples);
  const draft = useAppSelector((state) => state.conventionBuilder.exampleDraft);
  const update = (fields: Parameters<typeof ConventionBuilderActions.updateExampleDraft>[0]) =>
    dispatch(ConventionBuilderActions.updateExampleDraft(fields));

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>Examples ({examples.length})</h2>
      </div>
      <div className={styles.body}>
        {examples.map((example) => (
          <div key={example.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={example.kind === 'correct' ? styles.correct : styles.incorrect}>
                {example.kind === 'correct' ? 'Do' : "Don't"}
              </span>
              <span className={styles.itemTitle}>{example.title}</span>
              {example.path_hint ? <span className={styles.path}>{example.path_hint}</span> : null}
              <button
                type="button"
                onClick={() => void dispatch(deleteConventionExampleThunk(example.id))}
                className={styles.remove}
              >
                Remove
              </button>
            </div>
            <pre className={styles.code}>{example.code}</pre>
            {example.note ? <p className={styles.note}>{example.note}</p> : null}
          </div>
        ))}
        <div className={styles.form}>
          <p className={detailPageStyles.sectionTitle}>Add example</p>
          <div className={styles.grid}>
            <input value={draft.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" className={formFieldStyles.input} />
            <select value={draft.kind} onChange={(e) => update({ kind: e.target.value as ConventionExampleKind })} className={formFieldStyles.select}>
              {EXAMPLE_KINDS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              value={draft.language}
              onChange={(e) => update({ language: e.target.value as ConventionExampleLanguage })}
              className={formFieldStyles.select}
            >
              {EXAMPLE_LANGUAGES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <input value={draft.path_hint} onChange={(e) => update({ path_hint: e.target.value })} placeholder="Path hint (optional)" className={formFieldStyles.input} />
          </div>
          <textarea value={draft.code} onChange={(e) => update({ code: e.target.value })} placeholder="Code" className={formFieldStyles.codeTextarea} />
          <input value={draft.note} onChange={(e) => update({ note: e.target.value })} placeholder="Note (optional)" className={formFieldStyles.input} />
          <div>
            <button
              type="button"
              onClick={() => void dispatch(createConventionExampleThunk())}
              className={detailPageStyles.primaryButton}
              disabled={!draft.title.trim() || !draft.code.trim()}
            >
              Add example
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-4 flex flex-col gap-4`,
  item: `border border-gray-200 rounded p-3 flex flex-col gap-2`,
  itemHeader: `flex items-center gap-2 flex-wrap`,
  correct: `px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-green-50 text-green-700`,
  incorrect: `px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-red-50 text-red-700`,
  itemTitle: `text-xs font-medium text-gray-900`,
  path: `font-mono text-[11px] text-gray-500`,
  remove: `ml-auto text-xs text-gray-500 hover:text-red-600 bg-transparent border-none cursor-pointer`,
  code: `bg-gray-50 border border-gray-200 rounded p-2 text-[11px] font-mono text-gray-800 overflow-x-auto whitespace-pre`,
  note: `text-xs text-gray-600`,
  form: `flex flex-col gap-2 border-t border-gray-200 pt-4`,
  grid: `grid grid-cols-1 md:grid-cols-4 gap-2`,
};
