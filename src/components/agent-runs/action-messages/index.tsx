'use client';

import { useAppSelector } from '@/store';

/** Error / notice from the last action on the open run. */
export const ActionMessages = () => {
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  if (!builder.actionError && !builder.actionNotice) return null;
  return builder.actionError ? <p className={styles.error}>{builder.actionError}</p> : <p className={styles.notice}>{builder.actionNotice}</p>;
};

const styles = {
  error: `text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 whitespace-pre-wrap`,
  notice: `text-xs text-green-800 bg-green-50 border border-green-200 rounded px-3 py-2`,
};
