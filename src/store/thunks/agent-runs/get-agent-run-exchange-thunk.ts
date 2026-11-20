import { getAgentRunExchange } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { AgentRunExchangesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Opens one AI call of the current run (loads its prompt/response bodies once).
 */
export const getAgentRunExchangeThunk =
  (exchangeId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const runId = getState().currentAgentRun.id;
    if (!runId) return 400;
    dispatch(AgentRunsBuilderActions.setOpenExchange(getState().agentRunsBuilder.openExchangeId === exchangeId ? '' : exchangeId));
    if (getState().agentRunExchanges[exchangeId]) return 200;
    const response = await getAgentRunExchange(runId, exchangeId);
    if (!response.success || !response.data) return 500;
    dispatch(AgentRunExchangesActions.setExchange(response.data));
    return 200;
  };
