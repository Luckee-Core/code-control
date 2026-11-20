import { getAgentRunDetail } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { AgentRunDetailsActions, AgentRunsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the open run's detail (current agent run unless an id is given) and seeds the review
 * forms: one decision per proposed convention change, scope for template drafts.
 * `quiet` skips the loading state (polling).
 */
export const getAgentRunDetailThunk =
  (id?: string, quiet = false): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const runId = id ?? getState().currentAgentRun.id;
    if (!runId) return 400;
    if (!quiet) dispatch(AgentRunsBuilderActions.setDetail({ status: 'loading' }));
    const response = await getAgentRunDetail(runId);
    if (!response.success || !response.data) {
      dispatch(AgentRunsBuilderActions.setDetail({ status: 'error', error: response.error ?? 'Could not load the run' }));
      return 500;
    }
    const detail = response.data;
    dispatch(AgentRunDetailsActions.setDetail(detail));
    dispatch(AgentRunsActions.patchRun(detail.run));
    [...detail.lineage, ...detail.children].forEach((run) => dispatch(AgentRunsActions.patchRun(run)));
    if (detail.convention) {
      dispatch(
        AgentRunsBuilderActions.initDecisions(
          detail.convention.changes.filter((change) => change.status === 'proposed').map((change) => ({ id: change.id, after: change.after })),
        ),
      );
    }
    if (detail.template && detail.run.status === 'draft') {
      dispatch(AgentRunsBuilderActions.initScope(detail.template.propagations.filter((row) => row.status === 'pending').map((row) => row.convention_change_id)));
    }
    dispatch(AgentRunsBuilderActions.setDetail({ status: 'idle' }));
    return 200;
  };
