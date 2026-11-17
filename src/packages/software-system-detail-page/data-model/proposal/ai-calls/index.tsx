'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { DataModelProposalAiExchangeSummary } from '@/model/data-model-proposal-ai-exchange';
import { useAppSelector } from '@/store';

const EMPTY: DataModelProposalAiExchangeSummary[] = [];

const PURPOSE_LABEL = { generate: 'Generate', revise: 'Revise', auto_fix: 'Auto-fix' } as const;

/** AI calls recorded in the ledger for the selected version. */
export const AiCalls = () => {
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const exchanges = useAppSelector((state) =>
    selectedId ? state.dataModelProposalExchanges[selectedId] ?? EMPTY : EMPTY,
  );

  if (exchanges.length === 0) return null;

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>AI calls</h2>
          <p className={detailPageStyles.panelSubtitle}>Every model call for this version, from the AI ledger.</p>
        </div>
      </div>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Step</th>
              <th className={styles.th}>Model</th>
              <th className={styles.th}>Result</th>
              <th className={styles.th}>Tokens in / out</th>
              <th className={styles.th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange) => (
              <tr key={exchange.exchange_id} className={styles.row}>
                <td className={styles.td}>{PURPOSE_LABEL[exchange.purpose]}</td>
                <td className={`${styles.td} ${styles.mono}`}>
                  {exchange.served_by_model || exchange.model}
                  {exchange.served_by_model && exchange.served_by_model !== exchange.model ? (
                    <div className={styles.muted}>fallback from {exchange.model}</div>
                  ) : null}
                </td>
                <td className={styles.td}>
                  {exchange.status === 'ok' ? (
                    <span className={styles.ok}>ok</span>
                  ) : (
                    <span className={styles.err}>{exchange.error ?? 'error'}</span>
                  )}
                  {exchange.stop_reason ? <div className={styles.muted}>{exchange.stop_reason}</div> : null}
                </td>
                <td className={`${styles.td} ${styles.mono}`}>
                  {exchange.input_tokens.toLocaleString()} / {exchange.output_tokens.toLocaleString()}
                </td>
                <td className={`${styles.td} ${styles.mono}`}>{(exchange.duration_ms / 1000).toFixed(1)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const styles = {
  scroll: `overflow-x-auto`,
  table: `w-full text-xs border-collapse`,
  th: `
    text-left px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500
    border-b border-gray-200 whitespace-nowrap
  `,
  row: `border-b border-gray-100 align-top`,
  td: `px-3 py-1.5 text-gray-800`,
  mono: `font-mono tabular-nums`,
  muted: `text-[10px] text-gray-500`,
  ok: `text-green-700 font-medium`,
  err: `text-red-700`,
};
