'use client';

import { agentFormStyles } from '@/components/agent-runs';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';

/** What should change in this PR (the PR agent's input). */
export const FeedbackInput = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.agentRunsBuilder.updatePr.feedback);
  return (
    <label className={agentFormStyles.field}>
      <span className={agentFormStyles.label}>Feedback</span>
      <textarea
        value={value}
        onChange={(event) => dispatch(AgentRunsBuilderActions.setUpdatePrFeedback(event.target.value))}
        rows={6}
        autoFocus
        placeholder="e.g. POST handlers accept a string body; reject anything that isn't a JSON object with 400."
        className={agentFormStyles.textarea}
      />
      <span className={agentFormStyles.hint}>The PR agent changes this PR only. Convention and template updates come after, each as its own draft.</span>
    </label>
  );
};
