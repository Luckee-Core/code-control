import { approveAgentRun, type ConventionDecision } from '@/api/agent-runs';
import { AgentRunsBuilderActions } from '../../builders';
import { AgentRunsActions } from '../../dumps';
import type { AppThunk } from '../../types';
import { getAgentRunDetailThunk } from './get-agent-run-detail-thunk';
import { getAgentRunSummaryThunk } from './get-agent-run-summary-thunk';

const NEXT_LABEL: Record<string, string> = { convention: 'convention agent draft', template: 'template agent draft' };

/**
 * Approve: applies the open run's output. Convention runs send one decision per proposed change
 * (edited `after` JSON included). The next agent's drafts are added to the dump.
 */
export const approveAgentRunThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const runId = getState().currentAgentRun.id;
  const builder = getState().agentRunsBuilder;
  const detail = getState().agentRunDetails[runId];
  if (!runId || !detail) return 400;

  let decisions: ConventionDecision[] | undefined;
  if (detail.run.agent === 'convention' && detail.convention) {
    decisions = [];
    for (const change of detail.convention.changes.filter((item) => item.status === 'proposed')) {
      const draft = builder.decisions[change.id];
      if (!draft?.action) {
        dispatch(AgentRunsBuilderActions.setAction({ action: '', error: `Accept or reject ${change.convention_key} first` }));
        return 400;
      }
      if (draft.action === 'reject') {
        decisions.push({ change_id: change.id, action: 'reject' });
        continue;
      }
      let after: Record<string, unknown> | undefined;
      if (draft.editing) {
        try {
          after = JSON.parse(draft.afterText) as Record<string, unknown>;
        } catch {
          dispatch(AgentRunsBuilderActions.setAction({ action: '', error: `${change.convention_key}: the edited fields are not valid JSON` }));
          return 400;
        }
      }
      decisions.push({ change_id: change.id, action: 'accept', ...(after ? { after } : {}) });
    }
  }

  dispatch(AgentRunsBuilderActions.setAction({ action: 'approve' }));
  const response = await approveAgentRun(runId, { note: builder.decisionNote, ...(decisions ? { decisions } : {}) });
  if (!response.success || !response.data) {
    dispatch(AgentRunsBuilderActions.setAction({ action: '', error: response.error ?? 'Approve failed' }));
    return 500;
  }
  response.data.next.forEach((run) => dispatch(AgentRunsActions.patchRun(run)));
  const next = response.data.next;
  const notice =
    next.length > 0
      ? `Approved. Created ${next.length} ${NEXT_LABEL[next[0].agent] ?? 'draft'}${next.length === 1 ? '' : 's'}.`
      : 'Approved.';
  dispatch(AgentRunsBuilderActions.setAction({ action: '', notice }));
  await dispatch(getAgentRunDetailThunk(runId, true));
  void dispatch(getAgentRunSummaryThunk());
  return 200;
};
