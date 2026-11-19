'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { viewConventionSnapshotThunk } from '@/store/thunks/ai-context';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formatDate } from '@/utils/date-time';

const COLUMNS = ['Created', 'Domain', 'Role', 'Conventions', 'Hash', 'Uses', ''];

export const Snapshots = () => {
  const dispatch = useAppDispatch();
  const snapshots = useAppSelector((state) => state.conventionSnapshots);
  const options = useAppSelector((state) => state.conventionOptions);
  const roleNameByKey = useMemo(() => new Map(options.repo_roles.map((r) => [r.key, r.name])), [options.repo_roles]);
  const domainNameByKey = useMemo(() => new Map(options.domains.map((d) => [d.key, d.name])), [options.domains]);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Saved snapshots ({snapshots.length})</h2>
          <p className={detailPageStyles.panelSubtitle}>Frozen context. Identical content is stored once.</p>
        </div>
      </div>
      {snapshots.length === 0 ? (
        <p className={styles.empty}>No snapshots yet.</p>
      ) : (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                {COLUMNS.map((label) => (
                  <th key={label} className={styles.th}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snapshot) => (
                <tr key={snapshot.id}>
                  <td className={styles.cell}>{formatDate(snapshot.created_at)}</td>
                  <td className={styles.cell}>{domainNameByKey.get(snapshot.domain_key) ?? snapshot.domain_key}</td>
                  <td className={styles.cell}>{roleNameByKey.get(snapshot.role_key) ?? snapshot.role_key}</td>
                  <td className={styles.cell}>{snapshot.convention_count}</td>
                  <td className={styles.mono}>{snapshot.content_hash.slice(0, 12)}</td>
                  <td className={styles.cell}>{snapshot.use_count}</td>
                  <td className={styles.cell}>
                    <button
                      type="button"
                      onClick={() => void dispatch(viewConventionSnapshotThunk(snapshot.id))}
                      className={detailPageStyles.textLink}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const styles = {
  empty: `px-4 py-6 text-xs text-gray-500`,
  scroll: `overflow-x-auto`,
  table: `w-full border-collapse text-xs`,
  th: `px-3 py-2 text-left bg-gray-100 border-b border-gray-300 text-[10px] font-semibold text-gray-600 uppercase tracking-wide`,
  cell: `px-3 py-2 text-xs text-gray-900 border-b border-gray-200`,
  mono: `px-3 py-2 text-[11px] font-mono text-gray-700 border-b border-gray-200`,
};
