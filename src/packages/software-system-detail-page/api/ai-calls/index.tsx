'use client';

import { useEffect, useMemo } from 'react';
import { AiCallsTable } from '@/components/ai-calls-table';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { AiCostCall, AiCostSource } from '@/model/ai-cost-call';
import { useAppDispatch, useAppSelector } from '@/store';
import { getSoftwareSystemAiCallsThunk } from '@/store/thunks/software-systems';

const EMPTY: AiCostCall[] = [];

const AGENT_LABEL: Partial<Record<AiCostSource, string>> = {
  pr_agent: 'PR agent',
  convention_agent: 'Convention agent',
  template_agent: 'Template agent',
};

/**
 * AI calls for the API tab: the agent runs on its data-access (crud) pull requests — PR agent
 * edits plus the convention and template runs they led to — with estimated cost and a total.
 */
export const ApiAiCalls = () => {
  const dispatch = useAppDispatch();
  const softwareSystemId = useAppSelector((state) => state.currentSoftwareSystem.id);
  const loaded = useAppSelector((state) => (softwareSystemId ? state.softwareSystemAiCalls[softwareSystemId] : undefined));

  useEffect(() => {
    if (softwareSystemId) void dispatch(getSoftwareSystemAiCallsThunk());
  }, [dispatch, softwareSystemId]);

  const rows = useMemo(
    () =>
      (loaded ?? EMPTY)
        .filter((call) => call.delivery_kind === 'crud')
        .map((call) => ({
          id: `${call.source}:${call.id}`,
          step: `${AGENT_LABEL[call.source] ?? call.source}: ${call.purpose}`,
          item: call.source_label,
          model: call.model,
          served_by_model: call.served_by_model,
          status: call.status,
          error: call.error,
          stop_reason: call.stop_reason,
          input_tokens: call.input_tokens,
          output_tokens: call.output_tokens,
          duration_ms: call.duration_ms,
        })),
    [loaded],
  );

  if (!loaded) return null;
  if (rows.length === 0) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <h2 className={detailPageStyles.panelTitle}>AI calls</h2>
        </div>
        <p className={styles.empty}>No AI calls for the API pull requests yet.</p>
      </section>
    );
  }
  return (
    <AiCallsTable
      rows={rows}
      subtitle="Agent runs on the API pull requests (PR agent edits and the convention and template runs they led to), newest first. Costs are estimated from token counts and Anthropic list prices (not an invoice)."
    />
  );
};

const styles = {
  empty: `px-4 py-3 text-xs text-gray-500`,
};
