'use client';

import { AiCallsTable } from '@/components/ai-calls-table';
import type { DataModelProposalAiExchangeSummary } from '@/model/data-model-proposal-ai-exchange';
import { useAppSelector } from '@/store';

const EMPTY: DataModelProposalAiExchangeSummary[] = [];

const PURPOSE_LABEL = { generate: 'Generate', revise: 'Revise', auto_fix: 'Auto-fix' } as const;

/** AI calls recorded in the ledger for the selected version, with estimated cost per call. */
export const AiCalls = () => {
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const exchanges = useAppSelector((state) =>
    selectedId ? state.dataModelProposalExchanges[selectedId] ?? EMPTY : EMPTY,
  );

  return (
    <AiCallsTable
      rows={exchanges.map((exchange) => ({
        id: exchange.exchange_id,
        step: PURPOSE_LABEL[exchange.purpose],
        model: exchange.model,
        served_by_model: exchange.served_by_model,
        status: exchange.status,
        error: exchange.error,
        stop_reason: exchange.stop_reason,
        input_tokens: exchange.input_tokens,
        output_tokens: exchange.output_tokens,
        duration_ms: exchange.duration_ms,
      }))}
      subtitle="Every model call for this version, from the AI ledger. Costs are estimated from token counts and Anthropic list prices (not an invoice)."
    />
  );
};
