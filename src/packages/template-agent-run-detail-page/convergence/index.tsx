import { detailPageStyles } from '@/components/detail-page-styles';

export type MergedRepo = { repo: string; mergeSha: string; convergence: string | null; differingPaths: string[] };

type ConvergenceProps = { merged: MergedRepo[] };

/** After merge: each repo's merge commit, and whether the merged templates reproduce the fix the reviewer approved on the project PR. */
export const Convergence = ({ merged }: ConvergenceProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <h2 className={detailPageStyles.panelTitle}>Merged ({merged.length})</h2>
    </div>
    <ul className={styles.list}>
      {merged.map((item) => (
        <li key={item.repo} className={styles.item}>
          <p className={styles.repo}>
            {item.repo} <span className={styles.sha}>{item.mergeSha.slice(0, 7)}</span>
          </p>
          {item.convergence === 'converged' ? (
            <p className={styles.good}>Converged: re-rendering the original project PR with the merged templates produces exactly the fix the reviewer approved.</p>
          ) : item.convergence === 'diverged' ? (
            <>
              <p className={styles.bad}>Diverged: the merged templates don&apos;t reproduce the approved fix in these files (it may be project-specific, or the template change missed something):</p>
              <ul className={styles.paths}>
                {item.differingPaths.map((path) => (
                  <li key={path}>{path}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.muted}>No convergence check (the original PR isn&apos;t in this repo&apos;s role). New deliveries render with the merged templates.</p>
          )}
        </li>
      ))}
    </ul>
  </section>
);

const styles = {
  list: `divide-y divide-gray-200`,
  item: `px-4 py-2 flex flex-col gap-1`,
  repo: `text-xs font-medium text-gray-900`,
  sha: `font-mono text-[11px] text-gray-500`,
  good: `text-xs text-green-800`,
  bad: `text-xs text-amber-900`,
  muted: `text-xs text-gray-600`,
  paths: `list-disc pl-5 text-[11px] font-mono text-gray-800`,
};
