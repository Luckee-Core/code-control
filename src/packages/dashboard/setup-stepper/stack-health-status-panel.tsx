'use client';

import { useAppSelector } from '@/store';

const toneClass = (tone: string): string => {
  if (tone === 'ok') return styles.good;
  if (tone === 'bad') return styles.bad;
  if (tone === 'warn') return styles.warn;
  return styles.mutedStrong;
};

/**
 * Live dependency lines from the latest stack health probe (always visible on Home setup).
 */
export const StackHealthStatusPanel = () => {
  const stack = useAppSelector((state) => state.studioStackBuilder);
  const hasLines = stack.healthLines.length > 0;
  const hasResult =
    stack.status === 'ready' || stack.status === 'unavailable' || Boolean(stack.lastCheckedAt);
  const isReady = stack.status === 'ready';

  if (!hasResult && !stack.isProbing) {
    return (
      <div className={styles.panelNeutral} role="status">
        <p className={styles.title}>Health check</p>
        <p className={styles.nextStep}>
          Run the health check below to verify Express, storage, and Postgres. Results appear here
          and in a toast — not only in the browser console.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        stack.isProbing
          ? styles.panelChecking
          : isReady
            ? styles.panelOk
            : styles.panelWarn
      }
      role="status"
      aria-live="polite"
      aria-busy={stack.isProbing}
    >
      {stack.isProbing ? (
        <p className={styles.checkingRow}>
          <span className={styles.spinner} aria-hidden />
          Checking Express, storage, and database…
        </p>
      ) : null}

      {!stack.isProbing && isReady ? (
        <p className={styles.title}>All checks passed</p>
      ) : null}

      {!stack.isProbing && !isReady && stack.errorMessage ? (
        <p className={styles.titleFail}>{stack.errorMessage}</p>
      ) : null}

      {!stack.isProbing && !isReady && stack.errorHint ? (
        <p className={styles.nextStep}>{stack.errorHint}</p>
      ) : null}

      {hasLines ? (
        <ul className={styles.list}>
          {stack.healthLines.map((line) => (
            <li key={line.label}>
              {line.label}:{' '}
              <strong className={toneClass(line.tone)}>{line.status}</strong>
            </li>
          ))}
        </ul>
      ) : null}

      {stack.lastCheckedAt ? (
        <p className={styles.checkedAt}>Last checked {new Date(stack.lastCheckedAt).toLocaleString()}</p>
      ) : null}
    </div>
  );
};

const styles = {
  panelNeutral: `rounded border border-gray-300 bg-white p-4 mb-4`,
  panelChecking: `rounded border border-blue-300 bg-blue-50 p-4 mb-4`,
  panelOk: `rounded border border-green-300 bg-green-50 p-4 mb-4`,
  panelWarn: `rounded border border-amber-300 bg-amber-50 p-4 mb-4`,
  title: `text-sm font-semibold text-gray-900 m-0`,
  titleFail: `text-base font-semibold text-red-900 m-0`,
  nextStep: `text-sm text-gray-800 mt-2 leading-relaxed m-0`,
  checkingRow: `text-sm font-medium text-blue-900 m-0 flex items-center gap-2`,
  spinner: `
    inline-block h-4 w-4 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin
  `,
  list: `text-sm text-gray-800 space-y-1 list-disc pl-5 mt-3 mb-0`,
  checkedAt: `text-xs text-gray-500 mt-3 mb-0`,
  good: `text-green-800`,
  bad: `text-red-800`,
  warn: `text-amber-900`,
  mutedStrong: `text-gray-700 font-normal`,
};
