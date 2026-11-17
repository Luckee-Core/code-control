'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';

const formatElapsed = (ms: number): string => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

export const RunningState = () => {
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const createdAt = useAppSelector((state) =>
    selectedId ? state.dataModelProposals[selectedId]?.created_at : undefined,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsed = createdAt ? now - new Date(createdAt).getTime() : 0;

  return (
    <div className={styles.box} role="status">
      <span className={styles.dot} aria-hidden />
      <div>
        <p className={styles.title}>Designing tables… {formatElapsed(elapsed)}</p>
        <p className={styles.text}>
          The AI is reading the conventions and your context. This usually takes 1–4 minutes; if it breaks a MUST rule,
          one automatic fix pass runs. You can leave this tab open or come back later.
        </p>
      </div>
    </div>
  );
};

const styles = {
  box: `flex items-start gap-3 text-xs bg-blue-50 border border-blue-200 rounded px-4 py-3`,
  dot: `mt-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0`,
  title: `font-semibold text-blue-900 tabular-nums`,
  text: `text-blue-800 mt-0.5 leading-relaxed`,
};
