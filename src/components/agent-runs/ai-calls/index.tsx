'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { AiExchangeSummary } from '@/model/agent-run';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAgentRunExchangeThunk } from '@/store/thunks/agent-runs';

type AiCallsProps = { exchanges: AiExchangeSummary[] };

/** Every AI call the run made; expanding one loads its prompt and response. */
export const AiCalls = ({ exchanges }: AiCallsProps) => {
  const dispatch = useAppDispatch();
  const openId = useAppSelector((state) => state.agentRunsBuilder.openExchangeId);
  const bodies = useAppSelector((state) => state.agentRunExchanges);
  if (exchanges.length === 0) return null;
  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>AI calls</h2>
      </div>
      <ul className={styles.list}>
        {exchanges.map((exchange) => {
          const body = bodies[exchange.id];
          return (
            <li key={exchange.id} className={styles.item}>
              <button type="button" onClick={() => void dispatch(getAgentRunExchangeThunk(exchange.id))} className={styles.row}>
                <span className={styles.purpose}>{exchange.purpose}</span>
                <span className={exchange.status === 'ok' ? styles.ok : styles.failed}>{exchange.status}</span>
                <span className={styles.meta}>
                  {exchange.served_by_model || exchange.model} · {exchange.input_tokens.toLocaleString()} in / {exchange.output_tokens.toLocaleString()} out · {(exchange.duration_ms / 1000).toFixed(1)}s
                </span>
              </button>
              {exchange.error ? <p className={styles.error}>{exchange.error}</p> : null}
              {openId === exchange.id ? (
                body ? (
                  <div className={styles.bodies}>
                    <p className={detailPageStyles.sectionTitle}>System prompt</p>
                    <pre className={styles.pre}>{body.system_prompt}</pre>
                    <p className={detailPageStyles.sectionTitle}>User message</p>
                    <pre className={styles.pre}>{body.user_message}</pre>
                    <p className={detailPageStyles.sectionTitle}>Response</p>
                    <pre className={styles.pre}>{body.parsed ? JSON.stringify(body.parsed, null, 2) : body.raw_text}</pre>
                  </div>
                ) : (
                  <p className={styles.loading}>Loading…</p>
                )
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const styles = {
  list: `divide-y divide-gray-200`,
  item: `px-4 py-2`,
  row: `w-full flex flex-wrap items-center gap-3 text-left bg-transparent border-none p-0 cursor-pointer`,
  purpose: `text-xs font-medium text-gray-900 font-mono`,
  ok: `text-[10px] font-semibold uppercase text-green-700`,
  failed: `text-[10px] font-semibold uppercase text-red-700`,
  meta: `text-[11px] text-gray-500 ml-auto`,
  error: `text-xs text-red-700 mt-1`,
  bodies: `mt-2 flex flex-col gap-1`,
  pre: `text-[11px] font-mono bg-gray-50 border border-gray-200 rounded p-2 whitespace-pre-wrap max-h-80 overflow-auto`,
  loading: `text-xs text-gray-500 mt-1`,
};
