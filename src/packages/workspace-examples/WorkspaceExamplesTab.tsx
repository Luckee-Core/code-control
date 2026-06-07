'use client';

import { useAppSelector } from '@/store';

const styles = {
  container: `
    p-6 max-w-3xl
  `,
  title: `
    text-lg font-semibold text-gray-900 mb-4
  `,
  list: `
    space-y-4
  `,
  item: `
    border border-gray-200 rounded p-4
  `,
  itemHeader: `
    font-medium text-gray-900
  `,
  itemMeta: `
    text-xs text-gray-500
  `,
  itemCode: `
    mt-2 text-sm bg-gray-50 p-3 rounded overflow-x-auto font-mono
  `,
  empty: `
    text-sm text-gray-500 italic
  `,
};

export const WorkspaceExamplesTab = () => {
  const examples = useAppSelector((state) => state.buildExamples);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Examples</h2>
      {examples.length === 0 ? (
        <p className={styles.empty}>No examples yet. Add them via the API or seed data.</p>
      ) : (
        <div className={styles.list}>
          {examples.map((e) => (
            <div key={e.id} className={styles.item}>
              <div className={styles.itemHeader}>{e.name}</div>
              <div className={styles.itemMeta}>
                {e.tags?.join(', ')} · {e.language}
              </div>
              <pre className={styles.itemCode}>{e.code}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
