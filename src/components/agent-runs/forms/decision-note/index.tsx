'use client';

import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { agentFormStyles } from '../field-styles';

/** Note recorded with approve / reject / dismiss. */
export const DecisionNoteInput = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.agentRunsBuilder.decisionNote);
  return (
    <label className={agentFormStyles.field}>
      <span className={agentFormStyles.label}>Note (optional)</span>
      <textarea
        value={value}
        onChange={(event) => dispatch(AgentRunsBuilderActions.setDecisionNote(event.target.value))}
        rows={2}
        placeholder="Why you approve or reject (kept in the run history)"
        className={agentFormStyles.textarea}
      />
    </label>
  );
};
