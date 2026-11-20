import { reviseAgentRun } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { CurrentAgentRunActions } from '../../current';
import { AgentRunsActions } from '../../dumps';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';

/**
 * Revise / Request changes: supersedes the open run with a new version that carries the feedback
 * and starts it; the detail page switches to the new version.
 */
export const reviseAgentRunThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const feedback = getState().agentRunsBuilder.reviseFeedback.trim();
  if (!runId) return 400;
  if (!feedback) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: 'Write what should change first' }));
    return 400;
  }
  dispatch(AgentRunsBuilderActions.setAction({ action: 'revise' }));
  const response = await reviseAgentRun(runId, { feedback, run_now: true });
  if (!response.success || !response.data) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: response.error ?? 'Revise failed' }));
    return 500;
  }
  dispatch(AgentRunsActions.patchRun(response.data));
  dispatch(CurrentAgentRunActions.setId(response.data.id));
  dispatch(AgentRunsBuilderActions.openRun({ instructions: response.data.instructions, feedback: '', focusPaths: [] }));
  dispatch(AgentRunsBuilderActions.setAction({ action: '', notice: `Revising as v${response.data.version}…` }));
  await dispatch(getAgentRunDetailThunk(response.data.id, true));
  void dispatch(getAgentRunSummaryThunk());
  return 200;
};
