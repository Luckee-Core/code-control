'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { fieldStyles } from '../../field-styles';

export const CheckConfigInput = () => {
  const dispatch = useAppDispatch();
  const checkKind = useAppSelector((state) => state.currentConvention.check_kind);
  const text = useAppSelector((state) => state.conventionsBuilder.checkConfigText);

  if (checkKind === 'none') return null;

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Check config (JSON)</label>
      <textarea
        value={text}
        onChange={(event) => dispatch(ConventionsBuilderActions.setCheckConfigText(event.target.value))}
        placeholder={'{ "rule": "sql_forbidden", "patterns": ["CREATE\\\\s+TRIGGER"] }'}
        className={`${fieldStyles.textarea} ${fieldStyles.mono}`}
        spellCheck={false}
      />
      <span className={fieldStyles.hint}>
        Read by the linter. `rule` names the check; other keys are its parameters.
      </span>
    </div>
  );
};
