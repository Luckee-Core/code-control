import { getAgentRunSummary } from '@/api/agent-runs';
import { AgentRunSummaryActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads open-run counts per agent for the sidebar badges (failures are ignored).
 */
export const getAgentRunSummaryThunk = (): AppThunk<Promise<200 | 500>> => async (dispatch) => {
  const response = await getAgentRunSummary();
  if (!response.success || !response.data) return 500;
  dispatch(AgentRunSummaryActions.setSummary(response.data));
  return 200;
};
