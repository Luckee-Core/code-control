'use client';

import { useAppSelector } from '@/store';
import type { BuildConvention } from '@/model/build-convention';

const styles = {
  wrap: `
    border border-gray-200 rounded overflow-hidden
  `,
  table: `
    w-full text-sm
  `,
  th: `
    text-left font-medium text-gray-700 bg-gray-50 px-3 py-2 border-b border-gray-200
  `,
  td: `
    px-3 py-2 border-b border-gray-100
  `,
  empty: `
    text-sm text-gray-500 italic py-6 px-4
  `,
};

export const ConventionsTable = () => {
  const conventions = useAppSelector((state) => state.buildConventions);

  if (conventions.length === 0) {
    return (
      <div className={styles.wrap}>
        <p className={styles.empty}>No conventions yet. Add them via the API or seed data.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Stack</th>
            <th className={styles.th}>Repo type</th>
            <th className={styles.th}>Content</th>
          </tr>
        </thead>
        <tbody>
          {conventions.map((c: BuildConvention) => (
            <tr key={c.id}>
              <td className={styles.td}>{c.name}</td>
              <td className={styles.td}>{c.stack}</td>
              <td className={styles.td}>{c.repo_type}</td>
              <td className={styles.td}>
                <span className="line-clamp-3 text-gray-600">{c.content}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
