import { getTemplateRenderPreview } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { TemplateRunViewsActions, templateViewKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Renders the sample data model with the selected repo's template PR base and head templates (what future projects get).
 */
export const getTemplateRenderPreviewThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const repo = getState().agentRunsBuilder.templateRepo;
  if (!runId || !repo) return 400;
  dispatch(AgentRunsBuilderActions.setView({ status: 'loading' }));
  const response = await getTemplateRenderPreview(runId, repo);
  if (!response.success || !response.data) {
    dispatch(AgentRunsBuilderActions.setView({ status: 'error', error: response.error ?? 'Could not render the preview' }));
    return 500;
  }
  dispatch(TemplateRunViewsActions.setPreview({ key: templateViewKey(runId, repo), preview: response.data }));
  dispatch(AgentRunsBuilderActions.setView({ status: 'idle' }));
  return 200;
};
