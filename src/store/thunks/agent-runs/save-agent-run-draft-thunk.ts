import { updateAgentRunDraft } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';

/**
 * Saves the open draft (instructions; PR feedback and focus files).
 */
export const saveAgentRunDraftThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const builder = getState().agentRunsBuilder;
  if (!runId) return 400;
  const agent = getState().agentRunDetails[runId]?.run.agent;
  const call = () =>
    updateAgentRunDraft(runId, {
      instructions: builder.instructions,
      ...(agent === 'pr' ? { feedback: builder.draftFeedback, focus_paths: builder.draftFocusPaths } : {}),
    });
  dispatch(AgentRunsBuilderActions.setAction({ action: 'save' }));
  const response = await call();
  if (!response.success) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: response.error ?? 'Request failed' }));
    return 500;
  }
  dispatch(AgentRunsBuilderActions.setAction({ action: '', notice: 'Draft saved' }));
  await dispatch(getAgentRunDetailThunk(runId, true));
  void dispatch(getAgentRunSummaryThunk());
  return 200;
};
