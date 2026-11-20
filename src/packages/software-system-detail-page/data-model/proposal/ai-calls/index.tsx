'use client';

import { useMemo, useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { DataModelProposalAiExchangeSummary } from '@/model/data-model-proposal-ai-exchange';
import { useAppSelector } from '@/store';
import { computeExchangeCostUsd, formatEstimatedCostUsd, getAnthropicModelPricing } from '@/utils/ai-cost';

const EMPTY: DataModelProposalAiExchangeSummary[] = [];

const PURPOSE_LABEL = { generate: 'Generate', revise: 'Revise', auto_fix: 'Auto-fix' } as const;

/** The model that was billed: the fallback model when one served the call, else the requested one. */
const billedModel = (exchange: DataModelProposalAiExchangeSummary): string =>
  exchange.served_by_model || exchange.model;

/** AI calls recorded in the ledger for the selected version, with estimated cost per call. */
export const AiCalls = () => {
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const exchanges = useAppSelector((state) =>
    selectedId ? state.dataModelProposalExchanges[selectedId] ?? EMPTY : EMPTY,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totals = useMemo(
    () =>
      exchanges.reduce(
        (sum, exchange) => {
          const cost = computeExchangeCostUsd(exchange.input_tokens, exchange.output_tokens, billedModel(exchange));
          return {
            input: sum.input + exchange.input_tokens,
            output: sum.output + exchange.output_tokens,
            costUsd: sum.costUsd + (cost ?? 0),
            hasUnknown: sum.hasUnknown || cost === null,
          };
        },
        { input: 0, output: 0, costUsd: 0, hasUnknown: false },
      ),
    [exchanges],
  );

  if (exchanges.length === 0) return null;

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>AI calls</h2>
          <p className={detailPageStyles.panelSubtitle}>
            Every model call for this version, from the AI ledger. Costs are estimated from token counts and Anthropic
            list prices (not an invoice).
          </p>
        </div>
      </div>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Step</th>
              <th className={styles.th}>Model</th>
              <th className={styles.th}>Result</th>
              <th className={styles.thRight}>Tokens in / out</th>
              <th className={styles.thRight}>Time</th>
              <th className={styles.thRight}>Est. cost</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange) => {
              const model = billedModel(exchange);
              const rates = getAnthropicModelPricing(model);
              const cost = computeExchangeCostUsd(exchange.input_tokens, exchange.output_tokens, model);
              const isHovered = hoveredId === exchange.exchange_id;
              return (
                <tr key={exchange.exchange_id} className={styles.row}>
                  <td className={styles.td}>{PURPOSE_LABEL[exchange.purpose]}</td>
                  <td className={`${styles.td} ${styles.mono}`}>
                    {model}
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
                  <td className={`${styles.tdRight} ${styles.mono}`}>
                    {exchange.input_tokens.toLocaleString()} / {exchange.output_tokens.toLocaleString()}
                  </td>
                  <td className={`${styles.tdRight} ${styles.mono}`}>{(exchange.duration_ms / 1000).toFixed(1)}s</td>
                  <td className={`${styles.tdRight} ${styles.mono} relative`}>
                    <div
                      className={styles.costHoverWrap}
                      onMouseEnter={() => setHoveredId(exchange.exchange_id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <button type="button" className={styles.costButton} aria-label="Show pricing details">
                        {formatEstimatedCostUsd(cost)}
                        {!rates ? ' (unknown model pricing)' : ''}
                      </button>
                      {isHovered ? (
                        <div className={styles.tooltip} role="tooltip">
                          <div className={styles.tooltipLine}>Model: {model || 'Unknown'}</div>
                          <div className={styles.tooltipLine}>Input tokens: {exchange.input_tokens.toLocaleString()}</div>
                          <div className={styles.tooltipLine}>
                            Output tokens: {exchange.output_tokens.toLocaleString()} (incl. thinking)
                          </div>
                          <div className={styles.tooltipLine}>
                            Input rate: {rates ? `$${rates.input_cost_per_million_usd.toFixed(2)}/1M` : 'N/A'}
                          </div>
                          <div className={styles.tooltipLine}>
                            Output rate: {rates ? `$${rates.output_cost_per_million_usd.toFixed(2)}/1M` : 'N/A'}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td className={styles.td} colSpan={3}>
                Estimated total ({exchanges.length} {exchanges.length === 1 ? 'call' : 'calls'})
              </td>
              <td className={`${styles.tdRight} ${styles.mono}`}>
                {totals.input.toLocaleString()} / {totals.output.toLocaleString()}
              </td>
              <td className={styles.td} />
              <td className={`${styles.tdRight} ${styles.mono}`}>
                {formatEstimatedCostUsd(totals.costUsd)}
                {totals.hasUnknown ? '+' : ''}
              </td>
            </tr>
          </tfoot>
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
  thRight: `
    text-right px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500
    border-b border-gray-200 whitespace-nowrap
  `,
  row: `border-b border-gray-100 align-top`,
  totalRow: `bg-gray-50 font-semibold`,
  td: `px-3 py-1.5 text-gray-800`,
  tdRight: `px-3 py-1.5 text-gray-800 text-right whitespace-nowrap`,
  mono: `font-mono tabular-nums`,
  muted: `text-[10px] text-gray-500`,
  ok: `text-green-700 font-medium`,
  err: `text-red-700`,
  costHoverWrap: `relative inline-block text-right`,
  costButton: `cursor-default border-0 bg-transparent p-0 text-right font-semibold text-gray-900 hover:underline`,
  tooltip: `
    absolute right-0 z-20 mt-1 w-60 rounded-md border border-gray-200 bg-white p-2 text-left text-xs
    font-normal text-gray-800 shadow-lg
  `,
  tooltipLine: `block py-0.5 font-sans`,
};
