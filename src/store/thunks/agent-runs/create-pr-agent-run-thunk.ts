import { createPrAgentRun } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { AgentRunsActions } from '../../dumps';
import type { AppThunk } from '../../types';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';
import { openAgentRunThunk } from './open-agent-run-thunk';

/**
 * Update PR modal: creates the PR agent run from the modal's feedback (draft, or started right away)
 * and opens it as the current run. The caller navigates to the PR agent run page on 200.
 */
export const createPrAgentRunThunk =
  (runNow: boolean): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const { deliveryId, feedback, focusPaths } = getState().agentRunsBuilder.updatePr;
    if (!deliveryId) return 400;
    if (!feedback.trim()) {
      dispatch(AgentRunsBuilderActions.setUpdatePrStatus({ status: 'error', error: 'Describe what should change' }));
      return 400;
    }
    dispatch(AgentRunsBuilderActions.setUpdatePrStatus({ status: 'loading' }));
    const response = await createPrAgentRun(deliveryId, { feedback, focus_paths: focusPaths, run_now: runNow });
    if (!response.success || !response.data) {
      dispatch(AgentRunsBuilderActions.setUpdatePrStatus({ status: 'error', error: response.error ?? 'Could not create the run' }));
      return 500;
    }
    dispatch(AgentRunsActions.patchRun(response.data));
    dispatch(AgentRunsBuilderActions.closeUpdatePr());
    void dispatch(getAgentRunSummaryThunk());
    return dispatch(openAgentRunThunk(response.data));
  };
