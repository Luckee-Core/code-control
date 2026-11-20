import type { AgentRun } from '@/model/agent-run';
import { AgentRunsBuilderActions } from '../../builders';
import { CurrentAgentRunActions } from '../../current';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';

/**
 * Opens a run on its detail page: sets currentAgentRun, resets the forms from the run, loads detail.
 * The caller then router.push()es the agent's detail page.
 */
export const openAgentRunThunk =
  (run: Pick<AgentRun, 'id' | 'instructions' | 'input'>): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(CurrentAgentRunActions.setId(run.id));
    dispatch(
      AgentRunsBuilderActions.openRun({
        instructions: run.instructions ?? '',
        feedback: typeof run.input?.feedback === 'string' ? run.input.feedback : '',
        focusPaths: Array.isArray(run.input?.focus_paths) ? (run.input.focus_paths as string[]) : [],
      }),
    );
    return dispatch(getAgentRunDetailThunk(run.id));
  };
