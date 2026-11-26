'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { SystemBuildRunBuilderActions } from '@/store/builders';
import { formatDateTimeWithTime } from '@/utils/date-time';

type LogProps = {
  runId: string;
};

/** The run's log, collapsed by default. */
export const Log = ({ runId }: LogProps) => {
  const dispatch = useAppDispatch();
  const eventsById = useAppSelector((state) => state.systemBuildRunEvents);
  const isOpen = useAppSelector((state) => state.systemBuildRunBuilder.isLogOpen);

  const events = useMemo(
    () => Object.values(eventsById).filter((event) => event.run_id === runId).sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [eventsById, runId],
  );

  return (
    <div className={styles.wrap}>
      <button type="button" onClick={() => dispatch(SystemBuildRunBuilderActions.setLogOpen(!isOpen))} className={styles.toggle}>
        {isOpen ? 'Hide log' : `Show log (${events.length})`}
      </button>
      {isOpen ? (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.id} className={styles.item}>
              <span className={styles.time}>{formatDateTimeWithTime(event.created_at)}</span>
              <span>{event.message}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const styles = {
  wrap: `flex flex-col gap-1.5`,
  toggle: `self-start text-[11px] font-medium text-gray-600 hover:text-gray-900 hover:underline underline-offset-2 cursor-pointer`,
  list: `flex flex-col gap-1 max-h-64 overflow-y-auto border border-gray-200 rounded px-2 py-1.5 bg-gray-50`,
  item: `flex gap-2 text-[11px] text-gray-700 leading-relaxed`,
  time: `shrink-0 font-mono text-gray-400`,
};
