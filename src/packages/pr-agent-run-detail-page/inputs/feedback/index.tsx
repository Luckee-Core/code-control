'use client';

import { agentFormStyles } from '@/components/agent-runs';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';

/** The feedback the PR agent works from (editable while the run is a draft). */
export const FeedbackInput = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.agentRunsBuilder.draftFeedback);
  return (
    <label className={agentFormStyles.field}>
      <span className={agentFormStyles.label}>Feedback</span>
      <textarea
        value={value}
        onChange={(event) => dispatch(AgentRunsBuilderActions.setDraftFeedback(event.target.value))}
        rows={5}
        className={agentFormStyles.textarea}
      />
    </label>
  );
};
