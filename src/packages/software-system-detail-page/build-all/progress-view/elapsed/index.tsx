'use client';

import { useEffect, useState } from 'react';
import { formatElapsed } from '../../config';

type ElapsedProps = {
  startedAt: string;
  /** When the clock stopped (finished, paused or failed); null keeps it ticking. */
  stoppedAt: string | null;
};

/** Live run clock: ticks every second until the run stops. */
export const Elapsed = ({ startedAt, stoppedAt }: ElapsedProps) => {
  const [now, setNow] = useState(() => Date.now());
  const isTicking = stoppedAt === null;

  useEffect(() => {
    if (!isTicking) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isTicking]);

  const end = stoppedAt ? new Date(stoppedAt).getTime() : now;
  return <span className={styles.clock}>{formatElapsed(end - new Date(startedAt).getTime())}</span>;
};

const styles = {
  clock: `font-mono text-2xl font-semibold tabular-nums text-gray-900`,
};
