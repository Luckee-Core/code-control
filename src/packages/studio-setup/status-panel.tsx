'use client';

import { useCallback, useEffect, useState } from 'react';
import { getHealth, type HealthResponse } from '@/api/health';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; data: HealthResponse };

export const StatusPanel = () => {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });

  const refresh = useCallback(async () => {
    setState({ kind: 'loading' });
    const result = await getHealth();
    if (!result.success) {
      setState({ kind: 'error', message: result.error });
      return;
    }
    setState({ kind: 'ok', data: result.data });
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (state.kind === 'loading') {
    return (
      <div className={styles.panel}>
        <p className={styles.muted}>Checking API and database…</p>
      </div>
    );
  }

  if (state.kind === 'error') {
    return (
      <div className={styles.panelError}>
        <p className={styles.title}>API not reachable</p>
        <p className={styles.body}>{state.message}</p>
        <p className={styles.hint}>
          Start <code className={styles.code}>code-control-express-server</code> on port{' '}
          <strong>3012</strong> (Hub) or set <code className={styles.code}>CODE_CONTROL_API_URL</code>{' '}
          in <code className={styles.code}>code-control/.env.local</code>.
        </p>
        <button type="button" onClick={refresh} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  const { data } = state;
  const db = data.database ?? 'unconfigured';
  const dbOk = db === 'ok';
  const apiOk = data.status === 'ok' || data.status === 'degraded';

  return (
    <div className={dbOk && apiOk ? styles.panelOk : styles.panelWarn}>
      <div className={styles.statusRow}>
        <span className={styles.title}>Live status</span>
        <button type="button" onClick={refresh} className={styles.retryButton}>
          Refresh
        </button>
      </div>
      <ul className={styles.list}>
        <li>
          API: <strong>{apiOk ? 'reachable' : data.status}</strong>
        </li>
        <li>
          Postgres:{' '}
          <strong className={dbOk ? styles.good : styles.bad}>
            {db === 'ok' ? 'connected' : db}
          </strong>
        </li>
      </ul>
      {!dbOk && (
        <p className={styles.hint}>
          Set <code className={styles.code}>DATABASE_URL</code> in Express{' '}
          <code className={styles.code}>.env</code>, run{' '}
          <code className={styles.code}>npm run db:apply-migrations</code>, then restart the API.
        </p>
      )}
    </div>
  );
};

const styles = {
  panel: `
    rounded-lg border border-gray-200 bg-white p-4
  `,
  panelOk: `
    rounded-lg border border-green-200 bg-green-50 p-4
  `,
  panelWarn: `
    rounded-lg border border-amber-200 bg-amber-50 p-4
  `,
  panelError: `
    rounded-lg border border-red-200 bg-red-50 p-4
  `,
  statusRow: `
    flex items-center justify-between gap-2 mb-2
  `,
  title: `
    text-sm font-semibold text-gray-900
  `,
  body: `
    text-sm text-gray-700 mt-1
  `,
  muted: `
    text-sm text-gray-500
  `,
  hint: `
    text-xs text-gray-600 mt-3 leading-relaxed
  `,
  list: `
    text-sm text-gray-800 space-y-1 list-disc pl-5 m-0
  `,
  good: `text-green-800`,
  bad: `text-amber-900`,
  code: `
    font-mono text-xs bg-white/80 px-1 rounded
  `,
  retryButton: `
    text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer
    bg-transparent border-none px-0
  `,
};
