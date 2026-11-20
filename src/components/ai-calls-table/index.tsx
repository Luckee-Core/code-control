'use client';

import { Fragment, useState, type ReactNode } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { computeExchangeCostUsd, formatEstimatedCostUsd, getAnthropicModelPricing } from '@/utils/ai-cost';

/** One AI call as the table shows it (data-model proposal exchanges and agent run exchanges map to this). */
export type AiCallRow = {
  id: string;
  /** Step label, e.g. "Generate" or "pr_edit". */
  step: string;
  model: string;
  served_by_model: string;
  status: 'ok' | 'error';
  error: string | null;
  stop_reason: string | null;
  input_tokens: number;
  output_tokens: number;
  duration_ms: number;
};

type AiCallsTableProps = {
  rows: AiCallRow[];
  /** Panel subtitle under "AI calls". */
  subtitle: string;
  /** When set, clicking a step toggles `renderExpanded` below that row. */
  onToggle?: (id: string) => void;
  expandedId?: string;
  renderExpanded?: (id: string) => ReactNode;
};

/** The model that was billed: the fallback model when one served the call, else the requested one. */
const billedModel = (row: AiCallRow): string => row.served_by_model || row.model;

/**
 * Estimated cost of one call, or null when it can't be known: the model has no list price, or the
 * call failed before usage was reported (a dropped stream records 0 / 0 tokens but was still billed).
 */
const rowCost = (row: AiCallRow): number | null => {
  if (row.status === 'error' && row.input_tokens === 0 && row.output_tokens === 0) return null;
  return computeExchangeCostUsd(row.input_tokens, row.output_tokens, billedModel(row));
};

/**
 * "AI calls" panel: one row per model call with tokens, time and estimated cost (hover for the
 * rates), and the estimated total at the bottom. Used by the data-model tab and agent run pages.
 */
export const AiCallsTable = ({ rows, subtitle, onToggle, expandedId, renderExpanded }: AiCallsTableProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  if (rows.length === 0) return null;

  const totals = rows.reduce(
    (sum, row) => {
      const cost = rowCost(row);
      return {
        input: sum.input + row.input_tokens,
        output: sum.output + row.output_tokens,
        costUsd: sum.costUsd + (cost ?? 0),
        hasUnknown: sum.hasUnknown || cost === null,
      };
    },
    { input: 0, output: 0, costUsd: 0, hasUnknown: false },
  );

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>AI calls</h2>
          <p className={detailPageStyles.panelSubtitle}>{subtitle}</p>
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
            {rows.map((row) => {
              const model = billedModel(row);
              const rates = getAnthropicModelPricing(model);
              const cost = rowCost(row);
              const isHovered = hoveredId === row.id;
              const isExpanded = expandedId === row.id && Boolean(renderExpanded);
              return (
                <Fragment key={row.id}>
                  <tr className={styles.row}>
                    <td className={styles.td}>
                      {onToggle ? (
                        <button type="button" onClick={() => onToggle(row.id)} className={styles.stepButton}>
                          {isExpanded ? '▾' : '▸'} {row.step}
                        </button>
                      ) : (
                        row.step
                      )}
                    </td>
                    <td className={`${styles.td} ${styles.mono}`}>
                      {model}
                      {row.served_by_model && row.served_by_model !== row.model ? (
                        <div className={styles.muted}>fallback from {row.model}</div>
                      ) : null}
                    </td>
                    <td className={styles.td}>
                      {row.status === 'ok' ? (
                        <span className={styles.ok}>ok</span>
                      ) : (
                        <span className={styles.err}>{row.error ?? 'error'}</span>
                      )}
                      {row.stop_reason ? <div className={styles.muted}>{row.stop_reason}</div> : null}
                    </td>
                    <td className={`${styles.tdRight} ${styles.mono}`}>
                      {row.input_tokens.toLocaleString()} / {row.output_tokens.toLocaleString()}
                    </td>
                    <td className={`${styles.tdRight} ${styles.mono}`}>{(row.duration_ms / 1000).toFixed(1)}s</td>
                    <td className={`${styles.tdRight} ${styles.mono} relative`}>
                      <div
                        className={styles.costHoverWrap}
                        onMouseEnter={() => setHoveredId(row.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <button type="button" className={styles.costButton} aria-label="Show pricing details">
                          {formatEstimatedCostUsd(cost)}
                          {!rates ? ' (unknown model pricing)' : ''}
                        </button>
                        {isHovered ? (
                          <div className={styles.tooltip} role="tooltip">
                            <div className={styles.tooltipLine}>Model: {model || 'Unknown'}</div>
                            <div className={styles.tooltipLine}>Input tokens: {row.input_tokens.toLocaleString()}</div>
                            <div className={styles.tooltipLine}>
                              Output tokens: {row.output_tokens.toLocaleString()} (incl. thinking)
                            </div>
                            <div className={styles.tooltipLine}>
                              Input rate: {rates ? `$${rates.input_cost_per_million_usd.toFixed(2)}/1M` : 'N/A'}
                            </div>
                            <div className={styles.tooltipLine}>
                              Output rate: {rates ? `$${rates.output_cost_per_million_usd.toFixed(2)}/1M` : 'N/A'}
                            </div>
                            {cost === null && rates ? (
                              <div className={styles.tooltipLine}>Failed before usage was reported; cost unknown.</div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && renderExpanded ? (
                    <tr className={styles.row}>
                      <td className={styles.expanded} colSpan={6}>
                        {renderExpanded(row.id)}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td className={styles.td} colSpan={3}>
                Estimated total ({rows.length} {rows.length === 1 ? 'call' : 'calls'})
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
  stepButton: `bg-transparent border-0 p-0 text-left text-gray-800 cursor-pointer hover:underline font-mono`,
  expanded: `px-3 py-2 bg-gray-50`,
  costHoverWrap: `relative inline-block text-right`,
  costButton: `cursor-default border-0 bg-transparent p-0 text-right font-semibold text-gray-900 hover:underline`,
  tooltip: `
    absolute right-0 z-20 mt-1 w-60 rounded-md border border-gray-200 bg-white p-2 text-left text-xs
    font-normal text-gray-800 shadow-lg
  `,
  tooltipLine: `block py-0.5 font-sans`,
};
