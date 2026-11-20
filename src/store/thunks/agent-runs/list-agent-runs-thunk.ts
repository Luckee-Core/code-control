import { listAgentRuns, type AgentRunsQuery } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { AgentRunsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads agent runs for a list page (or a project's Data access rows) into the dump.
 * `quiet` skips the loading state (polling).
 */
export const listAgentRunsThunk =
  (query: AgentRunsQuery, quiet = false): AppThunk<Promise<200 | 500>> =>
  async (dispatch) => {
    if (!quiet) dispatch(AgentRunsBuilderActions.setList({ status: 'loading' }));
    const response = await listAgentRuns({ limit: 300, ...query });
    if (!response.success || !response.data) {
      dispatch(AgentRunsBuilderActions.setList({ status: 'error', error: response.error ?? 'Could not load agent runs' }));
      return 500;
    }
    dispatch(AgentRunsActions.upsertRuns(response.data));
    dispatch(AgentRunsBuilderActions.setList({ status: 'idle' }));
    return 200;
  };
