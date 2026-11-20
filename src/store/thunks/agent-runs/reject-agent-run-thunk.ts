import { rejectAgentRun } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';

/**
 * Reject: ends the chain (template runs close their PR and can revert the carried changes).
 */
export const rejectAgentRunThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const builder = getState().agentRunsBuilder;
  if (!runId) return 400;
  const call = () => rejectAgentRun(runId, { note: builder.decisionNote, revert_changes: builder.revertChanges });
  dispatch(AgentRunsBuilderActions.setAction({ action: 'reject' }));
  const response = await call();
  if (!response.success) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: response.error ?? 'Request failed' }));
    return 500;
  }
  dispatch(AgentRunsBuilderActions.setAction({ action: '', notice: 'Rejected.' }));
  await dispatch(getAgentRunDetailThunk(runId, true));
  void dispatch(getAgentRunSummaryThunk());
  return 200;
};
