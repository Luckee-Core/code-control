'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { AiExchangeSummary } from '@/model/agent-run';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAgentRunExchangeThunk } from '@/store/thunks/agent-runs';
import { computeExchangeCostUsd, formatEstimatedCostUsd, getAnthropicModelPricing } from '@/utils/ai-cost';

type AiCallsProps = { exchanges: AiExchangeSummary[] };

/** The model that was billed: the fallback model when one served the call, else the requested one. */
const billedModel = (exchange: AiExchangeSummary): string => exchange.served_by_model || exchange.model;

/**
 * Estimated cost of one call, or null when it can't be known: the model has no rates, or the call
 * failed before usage was reported (a dropped stream records 0 / 0 tokens but was still billed).
 */
const exchangeCost = (exchange: AiExchangeSummary): number | null => {
  if (exchange.status === 'error' && exchange.input_tokens === 0 && exchange.output_tokens === 0) return null;
  return computeExchangeCostUsd(exchange.input_tokens, exchange.output_tokens, billedModel(exchange));
};

/** "$4.00 / $20.00 per 1M tokens in / out" for the cost tooltip. */
const ratesTitle = (model: string): string => {
  const rates = getAnthropicModelPricing(model);
  if (!rates) return `No list price known for ${model || 'this model'}`;
  return `${model}: $${rates.input_cost_per_million_usd.toFixed(2)} / $${rates.output_cost_per_million_usd.toFixed(2)} per 1M tokens in / out (thinking counts as output)`;
};

/**
 * Every AI call the run made, with estimated cost per call and a total at the bottom; expanding a
 * call loads its prompt and response. Costs come from token counts and Anthropic list prices.
 */
export const AiCalls = ({ exchanges }: AiCallsProps) => {
  const dispatch = useAppDispatch();
  const openId = useAppSelector((state) => state.agentRunsBuilder.openExchangeId);
  const bodies = useAppSelector((state) => state.agentRunExchanges);
  if (exchanges.length === 0) return null;

  const totals = exchanges.reduce(
    (sum, exchange) => {
      const cost = exchangeCost(exchange);
      return {
        input: sum.input + exchange.input_tokens,
        output: sum.output + exchange.output_tokens,
        durationMs: sum.durationMs + exchange.duration_ms,
        costUsd: sum.costUsd + (cost ?? 0),
        hasUnknown: sum.hasUnknown || cost === null,
      };
    },
    { input: 0, output: 0, durationMs: 0, costUsd: 0, hasUnknown: false },
  );

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>AI calls</h2>
      </div>
      <ul className={styles.list}>
        {exchanges.map((exchange) => {
          const body = bodies[exchange.id];
          const model = billedModel(exchange);
          return (
            <li key={exchange.id} className={styles.item}>
              <button type="button" onClick={() => void dispatch(getAgentRunExchangeThunk(exchange.id))} className={styles.row}>
                <span className={styles.purpose}>{exchange.purpose}</span>
                <span className={exchange.status === 'ok' ? styles.ok : styles.failed}>{exchange.status}</span>
                <span className={styles.meta}>
                  {model} · {exchange.input_tokens.toLocaleString()} in / {exchange.output_tokens.toLocaleString()} out · {(exchange.duration_ms / 1000).toFixed(1)}s
                </span>
                <span className={styles.cost} title={ratesTitle(model)}>
                  {formatEstimatedCostUsd(exchangeCost(exchange))}
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
      <div className={styles.total}>
        <span className={styles.totalLabel}>
          Estimated total ({exchanges.length} {exchanges.length === 1 ? 'call' : 'calls'})
        </span>
        <span className={styles.meta}>
          {totals.input.toLocaleString()} in / {totals.output.toLocaleString()} out · {(totals.durationMs / 1000).toFixed(1)}s
        </span>
        <span className={styles.totalCost}>
          {formatEstimatedCostUsd(totals.costUsd)}
          {totals.hasUnknown ? '+' : ''}
        </span>
      </div>
      <p className={styles.note}>
        Estimated from token counts and Anthropic list prices, not an invoice.
        {totals.hasUnknown ? ' “—” marks a call whose cost is unknown (failed before usage was reported, or no list price), so the total may be higher.' : ''}
      </p>
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
  cost: `text-[11px] font-mono tabular-nums font-semibold text-gray-900 w-16 text-right`,
  error: `text-xs text-red-700 mt-1`,
  bodies: `mt-2 flex flex-col gap-1`,
  pre: `text-[11px] font-mono bg-gray-50 border border-gray-200 rounded p-2 whitespace-pre-wrap max-h-80 overflow-auto`,
  loading: `text-xs text-gray-500 mt-1`,
  total: `flex flex-wrap items-center gap-3 px-4 py-2 border-t border-gray-200 bg-gray-50`,
  totalLabel: `text-xs font-semibold text-gray-900`,
  totalCost: `text-xs font-mono tabular-nums font-semibold text-gray-900 w-16 text-right`,
  note: `px-4 pb-2 pt-1 text-[10px] text-gray-500 bg-gray-50`,
};
