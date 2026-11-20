import { getTemplateRunDiff } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { TemplateRunViewsActions, templateViewKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the current template run's PR diff in the selected template repo (whole PR or this run's commit) and selects the first file.
 */
export const getTemplateRunDiffThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const { diffScope: scope, templateRepo: repo } = getState().agentRunsBuilder;
  if (!runId || !repo) return 400;
  dispatch(AgentRunsBuilderActions.setView({ status: 'loading' }));
  const response = await getTemplateRunDiff(runId, repo, scope);
  if (!response.success || !response.data) {
    dispatch(AgentRunsBuilderActions.setView({ status: 'error', error: response.error ?? 'Could not load the diff' }));
    return 500;
  }
  dispatch(TemplateRunViewsActions.setDiff({ key: templateViewKey(runId, repo), scope, files: response.data }));
  if (!getState().agentRunsBuilder.selectedPath) dispatch(AgentRunsBuilderActions.selectPath(response.data[0]?.filename ?? ''));
  dispatch(AgentRunsBuilderActions.setView({ status: 'idle' }));
  return 200;
};
