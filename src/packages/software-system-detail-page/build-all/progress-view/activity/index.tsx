'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { PHASE_LABEL, STEP_TAB } from '../../config';

type ActivityProps = {
  runId: string;
};

type Item = { id: string; at: string; text: string };

/** Newest first, so a new line appears at the top. */
const LIMIT = 12;

/** A live feed: the run log plus each repo's latest move. */
export const Activity = ({ runId }: ActivityProps) => {
  const stepsById = useAppSelector((state) => state.systemBuildRunSteps);
  const eventsById = useAppSelector((state) => state.systemBuildRunEvents);

  const items = useMemo(() => {
    const fromEvents: Item[] = Object.values(eventsById)
      .filter((event) => event.run_id === runId)
      .map((event) => ({ id: event.id, at: event.created_at, text: event.message }));
    const fromRepos: Item[] = Object.values(stepsById)
      .filter((step) => step.run_id === runId)
      .flatMap((step) =>
        (step.progress?.repos ?? [])
          .filter((repo) => repo.phase !== 'queued')
          .map((repo) => ({
            id: `${step.id}:${repo.role}`,
            at: repo.updated_at,
            text: `${STEP_TAB[step.kind]} · ${repo.repo}: ${repo.phase === 'committing' && repo.files ? `committing ${repo.files} files` : PHASE_LABEL[repo.phase].toLowerCase()}${repo.pr_number && (repo.phase === 'merged' || repo.phase === 'open') ? ` (#${repo.pr_number})` : ''}`,
          })),
      );
    return [...fromEvents, ...fromRepos].sort((a, b) => b.at.localeCompare(a.at)).slice(0, LIMIT);
  }, [eventsById, stepsById, runId]);

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Activity</h2>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.id} className={`${styles.item} ${index === 0 ? styles.latest : ''}`}>
            <span className={styles.time}>{new Date(item.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  wrap: `bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-2`,
  title: `text-[10px] font-semibold uppercase tracking-wide text-gray-500`,
  list: `flex flex-col gap-1`,
  item: `flex gap-3 text-xs text-gray-600 leading-relaxed`,
  latest: `text-gray-900 font-medium`,
  time: `shrink-0 font-mono text-gray-400 tabular-nums`,
  text: `min-w-0 break-words`,
};
