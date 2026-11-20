import { getTemplateRunFile } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { TemplateRunViewsActions, templateViewKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads one template PR file's full content at base or head (once).
 */
export const getTemplateRunFileThunk =
  (path: string, at: 'base' | 'head'): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const runId = getState().currentAgentRun.id;
    const repo = getState().agentRunsBuilder.templateRepo;
    if (!runId || !repo || !path) return 400;
    const key = templateViewKey(runId, repo);
    if (getState().templateRunViews[key]?.files[`${at}:${path}`]) return 200;
    const response = await getTemplateRunFile(runId, repo, path, at);
    if (!response.success || !response.data) {
      dispatch(AgentRunsBuilderActions.setView({ status: 'error', error: response.error ?? 'Could not load the file' }));
      return 500;
    }
    dispatch(TemplateRunViewsActions.setFile({ key, file: response.data }));
    return 200;
  };
