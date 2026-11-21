'use client';

import { AiCallsTable } from '@/components/ai-calls-table';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { AiExchangeSummary } from '@/model/agent-run';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAgentRunExchangeThunk } from '@/store/thunks/agent-runs';

type AiCallsProps = { exchanges: AiExchangeSummary[] };

/**
 * Every AI call the run made, in the same table as the data-model tab (tokens, time, estimated
 * cost, total at the bottom). Clicking a step loads its prompt and response below the row.
 */
export const AiCalls = ({ exchanges }: AiCallsProps) => {
  const dispatch = useAppDispatch();
  const openId = useAppSelector((state) => state.agentRunsBuilder.openExchangeId);
  const bodies = useAppSelector((state) => state.agentRunExchanges);

  return (
    <AiCallsTable
      rows={exchanges.map((exchange) => ({
        id: exchange.id,
        step: exchange.purpose,
        model: exchange.model,
        served_by_model: exchange.served_by_model,
        status: exchange.status,
        error: exchange.error,
        stop_reason: exchange.stop_reason,
        input_tokens: exchange.input_tokens,
        output_tokens: exchange.output_tokens,
        duration_ms: exchange.duration_ms,
      }))}
      subtitle="Every model call for this run. Costs are estimated from token counts and Anthropic list prices (not an invoice). Click a step to see its prompt and response."
      onToggle={(id) => void dispatch(getAgentRunExchangeThunk(id))}
      expandedId={openId}
      renderExpanded={(id) => {
        const body = bodies[id];
        if (!body) return <p className={styles.loading}>Loading…</p>;
        return (
          <div className={styles.bodies}>
            <p className={detailPageStyles.sectionTitle}>System prompt</p>
            <pre className={styles.pre}>{body.system_prompt}</pre>
            <p className={detailPageStyles.sectionTitle}>User message</p>
            <pre className={styles.pre}>{body.user_message}</pre>
            <p className={detailPageStyles.sectionTitle}>Response</p>
            <pre className={styles.pre}>{body.parsed ? JSON.stringify(body.parsed, null, 2) : body.raw_text}</pre>
          </div>
        );
      }}
    />
  );
};

const styles = {
  bodies: `flex flex-col gap-1`,
  pre: `text-[11px] font-mono bg-white border border-gray-200 rounded p-2 whitespace-pre-wrap max-h-80 overflow-auto`,
  loading: `text-xs text-gray-500`,
};
