'use client';

import { agentFormStyles } from '@/components/agent-runs';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';

type AfterJsonInputProps = { changeId: string };

/** Reviewer edit of what a proposed change writes (JSON of the `after` fields). */
export const AfterJsonInput = ({ changeId }: AfterJsonInputProps) => {
  const dispatch = useAppDispatch();
  const decision = useAppSelector((state) => state.agentRunsBuilder.decisions[changeId]);
  return (
    <label className={agentFormStyles.field}>
      <span className={agentFormStyles.label}>Fields to write (JSON)</span>
      <textarea
        value={decision?.afterText ?? ''}
        onChange={(event) => dispatch(AgentRunsBuilderActions.setDecision({ id: changeId, patch: { afterText: event.target.value } }))}
        rows={10}
        spellCheck={false}
        className={`${agentFormStyles.textarea} font-mono`}
      />
    </label>
  );
};
