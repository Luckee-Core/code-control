'use client';

import { useEffect, useMemo, useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { AiCostCall, AiCostSource } from '@/model/ai-cost-call';
import { useAppDispatch, useAppSelector } from '@/store';
import { getSoftwareSystemAiCallsThunk } from '@/store/thunks/software-systems';
import { computeExchangeCostUsd, formatEstimatedCostUsd, getAnthropicModelPricing } from '@/utils/ai-cost';
import { formatDateTimeWithTime } from '@/utils/date-time';

const EMPTY: AiCostCall[] = [];

const SOURCE_LABEL: Record<AiCostSource, string> = {
  data_model: 'Data model',
  ticket_build: 'Ticket builds',
  pr_agent: 'PR agent',
  convention_agent: 'Convention agent',
  template_agent: 'Template agent',
};

const SOURCE_ORDER: AiCostSource[] = ['data_model', 'ticket_build', 'pr_agent', 'convention_agent', 'template_agent'];

/** The model that was billed: the fallback model when one served the call, else the requested one. */
const billedModel = (call: AiCostCall): string => call.served_by_model || call.model;

/**
 * Estimated cost of one call, or null when it can't be known: the model has no list price, or the
 * call failed before usage was reported (a dropped stream records 0 / 0 tokens but was still billed).
 */
const callCost = (call: AiCostCall): number | null => {
  if (call.status === 'error' && call.input_tokens === 0 && call.output_tokens === 0) return null;
  return computeExchangeCostUsd(call.input_tokens, call.output_tokens, billedModel(call));
};

type Totals = { calls: number; input: number; output: number; durationMs: number; costUsd: number; hasUnknown: boolean };

const EMPTY_TOTALS: Totals = { calls: 0, input: 0, output: 0, durationMs: 0, costUsd: 0, hasUnknown: false };

const addCall = (sum: Totals, call: AiCostCall): Totals => {
  const cost = callCost(call);
  return {
    calls: sum.calls + 1,
    input: sum.input + call.input_tokens,
    output: sum.output + call.output_tokens,
    durationMs: sum.durationMs + call.duration_ms,
    costUsd: sum.costUsd + (cost ?? 0),
    hasUnknown: sum.hasUnknown || cost === null,
  };
};

const formatCost = (totals: Totals): string => `${formatEstimatedCostUsd(totals.costUsd)}${totals.hasUnknown ? '+' : ''}`;

const formatSeconds = (ms: number): string => `${(ms / 1000).toFixed(1)}s`;

/** "$4.00 / $20.00 per 1M tokens in / out" for a cost cell's tooltip. */
const ratesTitle = (model: string): string => {
  const rates = getAnthropicModelPricing(model);
  if (!rates) return `No list price known for ${model || 'this model'}`;
  return `${model}: $${rates.input_cost_per_million_usd.toFixed(2)} / $${rates.output_cost_per_million_usd.toFixed(2)} per 1M tokens in / out (thinking counts as output)`;
};

/**
 * Estimated AI spend for the current software system across every tab: data-model proposals,
 * ticket builds and agent runs. A summary by area, then every call with the total at the bottom.
 */
export const AiCosts = () => {
  const dispatch = useAppDispatch();
  const softwareSystemId = useAppSelector((state) => state.currentSoftwareSystem.id);
  const loaded = useAppSelector((state) => (softwareSystemId ? state.softwareSystemAiCalls[softwareSystemId] : undefined));
  const calls = loaded ?? EMPTY;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!softwareSystemId) return;
    void dispatch(getSoftwareSystemAiCallsThunk()).then((status) => setFailed(status !== 200));
  }, [dispatch, softwareSystemId]);

  const total = useMemo(() => calls.reduce(addCall, EMPTY_TOTALS), [calls]);
  const bySource = useMemo(
    () =>
      SOURCE_ORDER.map((source) => ({
        source,
        totals: calls.filter((call) => call.source === source).reduce(addCall, EMPTY_TOTALS),
      })).filter((row) => row.totals.calls > 0),
    [calls],
  );

  if (!loaded) {
    return (
      <div className={detailPageStyles.panelBody}>
        <p className={styles.muted}>{failed ? 'Could not load AI calls.' : 'Loading…'}</p>
      </div>
    );
  }
  if (calls.length === 0) {
    return (
      <div className={detailPageStyles.panelBody}>
        <p className={styles.muted}>No AI calls for this software system yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <div>
            <h2 className={detailPageStyles.panelTitle}>AI costs by area</h2>
            <p className={detailPageStyles.panelSubtitle}>
              Estimated from each call&apos;s token counts and Anthropic list prices (not an invoice).
            </p>
          </div>
        </div>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Area</th>
                <th className={styles.thRight}>Calls</th>
                <th className={styles.thRight}>Tokens in / out</th>
                <th className={styles.thRight}>Time</th>
                <th className={styles.thRight}>Est. cost</th>
              </tr>
            </thead>
            <tbody>
              {bySource.map(({ source, totals }) => (
                <tr key={source} className={styles.row}>
                  <td className={styles.td}>{SOURCE_LABEL[source]}</td>
                  <td className={`${styles.tdRight} ${styles.mono}`}>{totals.calls}</td>
                  <td className={`${styles.tdRight} ${styles.mono}`}>
                    {totals.input.toLocaleString()} / {totals.output.toLocaleString()}
                  </td>
                  <td className={`${styles.tdRight} ${styles.mono}`}>{formatSeconds(totals.durationMs)}</td>
                  <td className={`${styles.tdRight} ${styles.mono} ${styles.cost}`}>{formatCost(totals)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td className={styles.td}>Estimated total</td>
                <td className={`${styles.tdRight} ${styles.mono}`}>{total.calls}</td>
                <td className={`${styles.tdRight} ${styles.mono}`}>
                  {total.input.toLocaleString()} / {total.output.toLocaleString()}
                </td>
                <td className={`${styles.tdRight} ${styles.mono}`}>{formatSeconds(total.durationMs)}</td>
                <td className={`${styles.tdRight} ${styles.mono}`}>{formatCost(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <div>
            <h2 className={detailPageStyles.panelTitle}>All AI calls</h2>
            <p className={detailPageStyles.panelSubtitle}>Newest first. Hover a cost for the model&apos;s rates.</p>
          </div>
        </div>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>When</th>
                <th className={styles.th}>Area</th>
                <th className={styles.th}>Item</th>
                <th className={styles.th}>Step</th>
                <th className={styles.th}>Model</th>
                <th className={styles.th}>Result</th>
                <th className={styles.thRight}>Tokens in / out</th>
                <th className={styles.thRight}>Time</th>
                <th className={styles.thRight}>Est. cost</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => {
                const model = billedModel(call);
                return (
                  <tr key={`${call.source}:${call.id}`} className={styles.row}>
                    <td className={`${styles.td} ${styles.nowrap}`}>{formatDateTimeWithTime(call.created_at)}</td>
                    <td className={`${styles.td} ${styles.nowrap}`}>{SOURCE_LABEL[call.source]}</td>
                    <td className={styles.td} title={call.source_label}>
                      <span className={styles.item}>{call.source_label || '—'}</span>
                    </td>
                    <td className={`${styles.td} ${styles.mono}`}>{call.purpose}</td>
                    <td className={`${styles.td} ${styles.mono}`}>
                      {model}
                      {call.served_by_model && call.served_by_model !== call.model ? (
                        <div className={styles.muted}>fallback from {call.model}</div>
                      ) : null}
                    </td>
                    <td className={styles.td}>
                      {call.status === 'ok' ? (
                        <span className={styles.ok}>ok</span>
                      ) : (
                        <span className={styles.err} title={call.error ?? undefined}>
                          {call.error ?? 'error'}
                        </span>
                      )}
                    </td>
                    <td className={`${styles.tdRight} ${styles.mono}`}>
                      {call.input_tokens.toLocaleString()} / {call.output_tokens.toLocaleString()}
                    </td>
                    <td className={`${styles.tdRight} ${styles.mono}`}>{formatSeconds(call.duration_ms)}</td>
                    <td className={`${styles.tdRight} ${styles.mono} ${styles.cost}`} title={ratesTitle(model)}>
                      {formatEstimatedCostUsd(callCost(call))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td className={styles.td} colSpan={6}>
                  Estimated total ({total.calls} {total.calls === 1 ? 'call' : 'calls'})
                </td>
                <td className={`${styles.tdRight} ${styles.mono}`}>
                  {total.input.toLocaleString()} / {total.output.toLocaleString()}
                </td>
                <td className={`${styles.tdRight} ${styles.mono}`}>{formatSeconds(total.durationMs)}</td>
                <td className={`${styles.tdRight} ${styles.mono}`}>{formatCost(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {total.hasUnknown ? (
          <p className={styles.note}>
            “—” marks a call whose cost is unknown (it failed before usage was reported, or its model has no list price), so
            “+” totals may be higher.
          </p>
        ) : null}
      </section>
    </div>
  );
};

const styles = {
  stack: `flex flex-col gap-3`,
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
  nowrap: `whitespace-nowrap`,
  item: `block max-w-xs truncate`,
  mono: `font-mono tabular-nums`,
  cost: `font-semibold text-gray-900`,
  muted: `text-xs text-gray-500`,
  ok: `text-green-700 font-medium`,
  err: `text-red-700 block max-w-[12rem] truncate`,
  note: `px-3 py-2 text-[10px] text-gray-500 bg-gray-50 border-t border-gray-200`,
};
