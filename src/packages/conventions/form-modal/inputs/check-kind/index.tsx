'use client';

import type { ConventionCheckKind } from '@/model/convention';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

const OPTIONS: { value: ConventionCheckKind; label: string }[] = [
  { value: 'none', label: 'None — guidance only' },
  { value: 'proposal', label: 'Proposal — lint AI data-model proposals' },
  { value: 'sql', label: 'SQL — lint rendered migrations' },
  { value: 'file_path', label: 'File path — lint generated file paths' },
];

export const CheckKindInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Automatic check</label>
      <select
        value={current.check_kind}
        onChange={(event) =>
          dispatch(CurrentConventionActions.updateFields({ check_kind: event.target.value as ConventionCheckKind }))
        }
        className={fieldStyles.select}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
