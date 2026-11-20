import { retryAgentRun } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';

/**
 * Retry: runs a failed run again with the same input.
 */
export const retryAgentRunThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const builder = getState().agentRunsBuilder;
  if (!runId) return 400;
  const call = () => retryAgentRun(runId);
  dispatch(AgentRunsBuilderActions.setAction({ action: 'retry' }));
  const response = await call();
  if (!response.success) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: response.error ?? 'Request failed' }));
    return 500;
  }
  dispatch(AgentRunsBuilderActions.setAction({ action: '', notice: 'Running again…' }));
  await dispatch(getAgentRunDetailThunk(runId, true));
  void dispatch(getAgentRunSummaryThunk());
  return 200;
};
