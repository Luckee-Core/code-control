import { dismissAgentRun } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';

/**
 * Dismiss: drops the open draft without running it.
 */
export const dismissAgentRunThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const builder = getState().agentRunsBuilder;
  if (!runId) return 400;
  const call = () => dismissAgentRun(runId, builder.decisionNote);
  dispatch(AgentRunsBuilderActions.setAction({ action: 'dismiss' }));
  const response = await call();
  if (!response.success) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: response.error ?? 'Request failed' }));
    return 500;
  }
  dispatch(AgentRunsBuilderActions.setAction({ action: '', notice: 'Dismissed.' }));
  await dispatch(getAgentRunDetailThunk(runId, true));
  void dispatch(getAgentRunSummaryThunk());
  return 200;
};
