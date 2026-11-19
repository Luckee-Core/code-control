'use client';

import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getTicketBuildAiExchangesByBuildIdThunk } from '@/store/thunks/ticket-builds';

/** Collapsed AI ledger for the build (purpose, model, tokens, duration). Fetches when opened. */
export const TicketBuildAudit = () => {
  const dispatch = useAppDispatch();
  const build = useAppSelector((state) => state.currentTicketBuild);
  const ticketBuildAiExchanges = useAppSelector((state) => state.ticketBuildAiExchanges);
  const [open, setOpen] = useState(false);
  const rows = useMemo(
    () => Object.values(ticketBuildAiExchanges).filter((row) => row.ticket_build_id === build.id),
    [build.id, ticketBuildAiExchanges],
  );

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => {
          if (!open) void dispatch(getTicketBuildAiExchangesByBuildIdThunk(build.id));
          setOpen(!open);
        }}
      >
        {open ? '▾' : '▸'} AI calls
      </button>
      {open ? (
        <ul className={styles.list}>
          {rows.length === 0 ? <li className={styles.item}>No AI calls recorded yet.</li> : null}
          {rows.map((row) => (
            <li key={row.exchange_id} className={styles.item}>
              {row.purpose} · {row.served_by_model || row.model} · {row.status} · {row.input_tokens.toLocaleString()} in /{' '}
              {row.output_tokens.toLocaleString()} out · {Math.round(row.duration_ms / 1000)}s
              {row.error ? ` · ${row.error}` : ''}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const styles = {
  wrap: `flex flex-col gap-1`,
  toggle: `self-start text-xs text-gray-500 hover:text-gray-800 cursor-pointer`,
  list: `flex flex-col gap-0.5 pl-4`,
  item: `text-xs text-gray-600 break-all`,
};
