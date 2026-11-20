import { confirmAgentRun, updateAgentRunDraft } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';

/**
 * Confirm: starts the open draft (saves PR feedback first; template drafts send their scope).
 */
export const confirmAgentRunThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const builder = getState().agentRunsBuilder;
  const detail = getState().agentRunDetails[runId];
  if (!runId || !detail) return 400;
  dispatch(AgentRunsBuilderActions.setAction({ action: 'confirm' }));
  if (detail.run.agent === 'pr') {
    if (!builder.draftFeedback.trim()) {
      dispatch(AgentRunsBuilderActions.setAction({ action: '', error: 'Add feedback before running' }));
      return 400;
    }
    const saved = await updateAgentRunDraft(runId, { feedback: builder.draftFeedback, focus_paths: builder.draftFocusPaths });
    if (!saved.success) {
      dispatch(AgentRunsBuilderActions.setAction({ action: '', error: saved.error ?? 'Could not save the draft' }));
      return 500;
    }
  }
  const scope =
    detail.run.agent === 'template'
      ? Object.entries(builder.scope).filter(([, included]) => included).map(([id]) => id)
      : undefined;
  const response = await confirmAgentRun(runId, { instructions: builder.instructions, ...(scope ? { scope_change_ids: scope } : {}) });
  if (!response.success) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: response.error ?? 'Could not start the run' }));
    return 500;
  }
  dispatch(AgentRunsBuilderActions.setAction({ action: '', notice: 'Running…' }));
  await dispatch(getAgentRunDetailThunk(runId, true));
  void dispatch(getAgentRunSummaryThunk());
  return 200;
};
