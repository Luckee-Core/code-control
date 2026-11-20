'use client';

import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { agentFormStyles } from '../field-styles';

/** Extra instructions passed to the agent when the draft runs. */
export const InstructionsInput = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.agentRunsBuilder.instructions);
  return (
    <label className={agentFormStyles.field}>
      <span className={agentFormStyles.label}>Instructions (optional)</span>
      <textarea
        value={value}
        onChange={(event) => dispatch(AgentRunsBuilderActions.setInstructions(event.target.value))}
        rows={3}
        placeholder="Anything the agent should know or focus on"
        className={agentFormStyles.textarea}
      />
    </label>
  );
};
