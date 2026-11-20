import type { AgentRunFinding } from '@/model/agent-run';

type FindingsProps = { findings: AgentRunFinding[] };

/** Deterministic check results on an agent's output (errors first). */
export const Findings = ({ findings }: FindingsProps) => {
  if (findings.length === 0) return <p className={styles.ok}>All checks passed.</p>;
  const sorted = [...findings].sort((a, b) => Number(b.severity === 'error') - Number(a.severity === 'error'));
  return (
    <ul className={styles.list}>
      {sorted.map((finding, index) => (
        <li key={`${finding.path}-${index}`} className={finding.severity === 'error' ? styles.error : styles.warning}>
          <span className={styles.severity}>{finding.severity}</span>
          {finding.path ? <span className={styles.path}>{finding.path}</span> : null}
          <span>{finding.message}</span>
          {finding.convention_key ? <span className={styles.key}>{finding.convention_key}</span> : null}
        </li>
      ))}
    </ul>
  );
};

const styles = {
  ok: `text-xs text-green-700`,
  list: `flex flex-col gap-1`,
  error: `flex flex-wrap items-baseline gap-2 text-xs text-red-800 bg-red-50 border border-red-200 rounded px-2 py-1`,
  warning: `flex flex-wrap items-baseline gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded px-2 py-1`,
  severity: `text-[10px] font-semibold uppercase`,
  path: `font-mono text-[11px]`,
  key: `font-mono text-[10px] text-gray-500 ml-auto`,
};
