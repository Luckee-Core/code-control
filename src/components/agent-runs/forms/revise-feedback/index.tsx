'use client';

import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { agentFormStyles } from '../field-styles';

type ReviseFeedbackInputProps = { label: string; placeholder: string };

/** Feedback for a new version of the run (Revise / Request changes). */
export const ReviseFeedbackInput = ({ label, placeholder }: ReviseFeedbackInputProps) => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.agentRunsBuilder.reviseFeedback);
  return (
    <label className={agentFormStyles.field}>
      <span className={agentFormStyles.label}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => dispatch(AgentRunsBuilderActions.setReviseFeedback(event.target.value))}
        rows={3}
        placeholder={placeholder}
        className={agentFormStyles.textarea}
      />
    </label>
  );
};
